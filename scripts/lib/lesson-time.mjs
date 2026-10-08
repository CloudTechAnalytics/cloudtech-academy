// How long a lesson honestly takes, worked out from its content. The minutes in a lesson's
// front matter must stay close to this (npm run test:content checks it).
//
// The estimate covers the required path: reading, running the examples, following the
// walkthrough steps in the tool, the required tasks and the end-of-lesson quiz.
// Optional work (challenges and the "More practice" drills) isn't counted.
//
// Hands-on work the content can't show, such as following steps in Excel outside a
// Walkthrough section, is declared in the front matter as `handsOn: <minutes>` and added.

/** Words a learner reads per minute in a lesson with examples to follow. */
export const READING_WPM = 200;
/** Time a task takes when it doesn't say: a SQL exercise or an answer task. */
const DEFAULT_TASK_MINUTES = { exercise: 4, answer: 3 };
/** Running an example (SQL in the browser, Python in Colab) or doing one walkthrough step in a tool. */
const STEP_MINUTES = 1;

const fence = (body, lang) => [...body.matchAll(new RegExp("```" + lang + "\\s*\\n([\\s\\S]*?)\\n```", "g"))].map((m) => m[1]);
const parse = (json) => {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

/** The body without its optional "More practice" section. */
const requiredPart = (body) => body.replace(/\n## More practice\n[\s\S]*?(?=\n## |$)/, "\n");

export function lessonTime(body, handsOn = 0) {
  const main = requiredPart(body);
  const prose = main.replace(/```(exercise|answer|task|webtask|live|quiz|dataset)\s*\n[\s\S]*?\n```/g, "");
  const reading = prose.split(/\s+/).filter(Boolean).length / READING_WPM;

  let tasks = 0;
  let requiredTasks = 0;
  for (const lang of ["exercise", "answer", "task"])
    for (const t of fence(main, lang).map(parse)) {
      if (!t?.required) continue;
      requiredTasks++;
      tasks += t.minutes ?? DEFAULT_TASK_MINUTES[lang] ?? 0;
    }
  // A web task's JSON header is the text before its first === line.
  for (const t of fence(main, "webtask").map((b) => parse(b.split(/\n===/)[0]))) {
    if (!t?.required) continue;
    requiredTasks++;
    tasks += t.minutes ?? 0;
  }
  const quiz = fence(main, "quiz").reduce((n, q) => n + (parse(q)?.length ?? 0) * 0.5, 0);

  const examples = fence(main, "sql run").length + fence(main, "python").length + fence(main, "live").length;
  const walkthrough = main.match(/\n## Walkthrough\n([\s\S]*?)(?=\n## |$)/)?.[1] ?? "";
  const steps = (walkthrough.match(/^\d+\.\s/gm) ?? []).length;

  return { minutes: reading + tasks + quiz + (examples + steps) * STEP_MINUTES + handsOn, requiredTasks };
}

/** True when the stated minutes are close enough to the estimate. */
export const timingOk = (stated, estimate) => stated >= estimate * 0.8 - 2 && stated <= estimate * 1.25 + 3;

/** The minutes to state for an estimate: whole minutes, rounded to 5 above 10. */
export const roundMinutes = (estimate) => (estimate <= 10 ? Math.max(5, Math.ceil(estimate)) : Math.round(estimate / 5) * 5);
