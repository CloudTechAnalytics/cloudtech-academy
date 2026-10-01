---
title: The agent loop
minutes: 15
summary: Write the loop that runs an agent (send, check for tool calls, run them, send results back) with a step limit, a stop on repeated failures, and a full trace of every step.
---

## The problem

The agent loop is a few lines of code, and it's where many agent failures begin. In v1's testing, three runs never finished: the model kept asking for the same tool call with the same arguments, got the same error each time, and only stopped when the loop hit its limit of 14 steps. Each wasted step cost tokens and time, and the customer got no reply at all.

A production loop needs more than "keep going until the model stops". It needs limits, a way to detect it's stuck, and a record of everything.

## The concept

**The loop**

1. Send the conversation and tool definitions to the model.
2. If the response asks for tool calls, run each one, append the results to the conversation, and go back to 1.
3. If it doesn't, the model has given its final answer: stop.

**Guards every loop needs**

| Guard | Why |
| :-- | :-- |
| **Maximum steps** | a stuck agent stops, and the request goes to a person |
| **Repeated-call detection** | the same tool with the same arguments failing twice means it won't work a third time |
| **Timeouts and retries** | a tool that fails once may work on retry; one that fails repeatedly shouldn't block the run |
| **A trace** | every step logged: tool, arguments, result, tokens, time |
| **A fallback** | when a guard stops the run, the customer is told a person will follow up |

## Example

With the Anthropic SDK, the loop looks like this (run it in Colab with your own key):

```python norun
import anthropic, json
from google.colab import userdata

client = anthropic.Anthropic(api_key=userdata.get("ANTHROPIC_API_KEY"))

def run_agent(session_account, message, max_steps=8):
    messages = [{"role": "user", "content": message}]
    trace = []
    for step in range(max_steps):
        response = client.messages.create(model="claude-sonnet-5", max_tokens=500, system=SYSTEM_PROMPT,
                                          tools=TOOLS, messages=messages)
        messages.append({"role": "assistant", "content": response.content})
        calls = [block for block in response.content if block.type == "tool_use"]
        if not calls:
            return response.content[0].text, trace          # final answer
        results = []
        for c in calls:
            output = run_tool(session_account, c.name, c.input)   # your code runs the tool
            trace.append({"step": step + 1, "tool": c.name, "arguments": c.input, "result": output})
            results.append({"type": "tool_result", "tool_use_id": c.id, "content": json.dumps(output)})
        messages.append({"role": "user", "content": results})
    return "A member of our team will follow up on this.", trace   # step limit reached
```

You can test the same loop logic without a model by replaying the recorded decisions. Here, a stand-in "model" returns v1's recorded tool calls for one request, and the loop adds a guard that v1 didn't have:

```python
import json
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/agents/"
steps = pd.read_csv(base + "steps.csv")
runs = pd.read_csv(base + "runs.csv")

def replay(run_id):
    """A stand-in model that asks for the calls recorded in a run, in order."""
    recorded = steps[steps["run_id"] == run_id].to_dict("records")
    return iter([(s["tool"], s["arguments"], s["result"]) for s in recorded])

def guarded_loop(run_id, max_steps=8, max_repeats=2):
    seen = {}
    for n, (tool, args, result) in enumerate(replay(run_id), start=1):
        if n > max_steps:
            return "stopped: step limit", n - 1
        if result != "ok":
            seen[(tool, args)] = seen.get((tool, args), 0) + 1
            if seen[(tool, args)] >= max_repeats:
                return "stopped: same call failed twice", n
        if tool == "reply":
            return "completed", n
    return "stopped: no reply", n

stuck = runs.loc[runs["stop_reason"] == "max_steps", "run_id"].tolist()
print("v1 runs that hit the 14-step limit:", stuck)
for run_id in stuck:
    print(run_id, guarded_loop(run_id))
```

```text
v1 runs that hit the 14-step limit: ['RQ056-v1', 'RQ069-v1', 'RQ074-v1']
RQ056-v1 ('stopped: same call failed twice', 2)
RQ069-v1 ('stopped: same call failed twice', 2)
RQ074-v1 ('stopped: same call failed twice', 2)
```

With the repeated-call guard, each stuck run stops after two steps instead of fourteen. The customer would then get the fallback reply and a person would follow up, rather than waiting through twelve wasted calls.

## Walkthrough

1. Run the cells. Run `guarded_loop` on every run and count how many stop early.
2. Lower `max_steps` to 4. Do any of v2's legitimate runs get cut off? (Check the longest v2 run first.)
3. Add a guard that stops when the total input tokens of a run pass 15,000.
4. If you have a key, run the real loop on three requests with the scoped tools from lesson 2.

## Practice

```answer
{
  "id": "agt-03-p1",
  "prompt": "How many steps did the three stuck v1 runs use **in total**?",
  "answer": 42,
  "format": "number",
  "dataset": "agents",
  "files": ["runs"],
  "pyVerify": "int(runs.loc[runs['stop_reason'] == 'max_steps', 'steps'].sum())",
  "hint": "Sum the steps column for runs whose stop_reason is max_steps.",
  "required": true
}
```

```answer
{
  "id": "agt-03-p2",
  "prompt": "What is the **longest** v2 run, in steps?",
  "answer": 5,
  "format": "number",
  "dataset": "agents",
  "files": ["runs"],
  "pyVerify": "int(runs.loc[runs['version'] == 'v2', 'steps'].max())",
  "hint": "The maximum of steps for v2.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "How does the loop know the model has finished?",
    "options": ["It counts to ten", "The response contains no tool calls, only a final answer", "The tools stop working", "The customer replies"],
    "answer": 1,
    "explanation": "No tool calls means the model has answered."
  },
  {
    "prompt": "The same tool call fails twice with the same arguments. What should the loop do?",
    "options": ["Keep trying until it works", "Stop the run, tell the customer a person will follow up, and log it", "Try a different customer", "Raise the step limit"],
    "answer": 1,
    "explanation": "Repeating a failing call wastes time and money."
  },
  {
    "prompt": "Why test loop logic by replaying recorded runs?",
    "options": ["It's more accurate than a model", "It's free, repeatable and lets you test guards on known failure cases", "Models can't be tested", "It trains the model"],
    "answer": 1,
    "explanation": "Recorded traces make agent code testable."
  }
]
```
