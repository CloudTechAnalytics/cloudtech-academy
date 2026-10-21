"""Draws the diagrams for the AI Productivity foundation lessons as SVG files, in the Academy's colours.

    python scripts/lesson-diagrams.py

Each diagram is described in a few lines below, so changing the wording or a colour is an edit here and a re-run.
Output goes to public/images/courses/ai-productivity/. Run `npm run images` afterwards to refresh the image sizes.
"""
from html import escape
from pathlib import Path
import textwrap

OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "courses" / "ai-productivity"
INK, MUTED, BG = "#2A2926", "#5E5A52", "#FBF8F2"
GOLD, GOLD_DARK, GOLD_PALE = "#C9A45C", "#8A6A1F", "#F3EBD8"
GREEN, GREEN_PALE = "#1F6F43", "#E1F0E7"
RED, RED_PALE = "#9B2C1F", "#F6E3E0"
BLUE, BLUE_PALE = "#2F4F7F", "#E3EAF4"
FONT = "Inter, 'Segoe UI', Arial, sans-serif"


class Svg:
    def __init__(self, w, h, title, desc):
        self.w, self.h = w, h
        self.title, self.desc = title, desc
        self.parts = []

    def rect(self, x, y, w, h, fill, stroke=None, rx=10, sw=1.5):
        s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"{s}/>')

    def circle(self, cx, cy, r, fill, stroke=None, sw=1.5):
        s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
        self.parts.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"{s}/>')

    def line(self, x1, y1, x2, y2, color=MUTED, sw=1.5, arrow=False):
        end = ' marker-end="url(#arrow)"' if arrow else ""
        self.parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{sw}"{end}/>')

    def text(self, x, y, s, size=13, color=INK, weight=400, anchor="start", wrap=0, lead=None):
        lines = textwrap.wrap(s, wrap) if wrap else [s]
        lead = lead or size * 1.3
        for i, ln in enumerate(lines):
            self.parts.append(f'<text x="{x}" y="{y + i * lead:.1f}" font-size="{size}" fill="{color}" font-weight="{weight}" text-anchor="{anchor}">{escape(ln)}</text>')
        return len(lines)

    def save(self, name):
        head = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" width="{self.w}" height="{self.h}" role="img" aria-label="{escape(self.desc, quote=True)}">\n'
            f"<title>{escape(self.title)}</title>\n"
            f'<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="{MUTED}"/></marker></defs>\n'
            f'<rect width="{self.w}" height="{self.h}" fill="{BG}"/>\n<g font-family="{FONT}">\n'
        )
        OUT.mkdir(parents=True, exist_ok=True)
        (OUT / name).write_text(head + "\n".join(self.parts) + "\n</g>\n</svg>\n", encoding="utf-8")
        print("wrote", name)


# 1. How the words fit together: nested circles ---------------------------------------------------------------
s = Svg(760, 470, "AI, machine learning, deep learning and generative AI, one inside the other.",
        "Four nested circles. The biggest is artificial intelligence, software that does tasks that normally need human intelligence. Inside it is machine learning, software that learns patterns from examples. Inside that is deep learning, which uses many-layered neural networks. The smallest is generative AI, which creates new text, images, audio, video and code; ChatGPT and Claude belong here.")
cx, cy = 230, 218
s.circle(cx, cy, 200, GOLD_PALE, GOLD_DARK)
s.circle(cx, cy + 40, 156, "#EFE4CC", GOLD_DARK)
s.circle(cx, cy + 80, 112, "#E6D5AE", GOLD_DARK)
s.circle(cx, cy + 118, 68, GOLD, GOLD_DARK)
s.text(cx, 48, "Artificial intelligence (AI)", 14, INK, 700, "middle")
s.text(cx, 118, "Machine learning", 13.5, INK, 700, "middle")
s.text(cx, 184, "Deep learning", 13, INK, 700, "middle")
s.text(cx, 326, "Generative", 12.5, INK, 700, "middle")
s.text(cx, 342, "AI", 12.5, INK, 700, "middle")
rows = [
    (50, "Artificial intelligence", "Software that does tasks that normally need human intelligence.", "Spam filters, map routes, chess"),
    (140, "Machine learning", "Learns patterns from examples instead of following only fixed rules.", "Bank fraud alerts, product recommendations"),
    (230, "Deep learning", "Machine learning with many-layered neural networks.", "Face unlock, voice typing, translation"),
    (320, "Generative AI", "Creates new text, images, audio, video and code.", "ChatGPT, Claude, Gemini, image makers"),
]
for y, h, d, e in rows:
    s.rect(470, y - 22, 276, 84, "#FFFFFF", GOLD_DARK, 8, 1)
    s.text(482, y - 3, h, 13, GOLD_DARK, 700)
    s.text(482, y + 14, d, 11.5, INK, 400, wrap=40, lead=14)
    s.text(482, y + 50, e, 10.5, MUTED, 400, wrap=46)
s.text(16, 458, "Every circle is inside the one before it: all generative AI is deep learning, machine learning and AI, but not the other way round.", 11, MUTED)
s.save("ai-nested.svg")

# 2. A short history -------------------------------------------------------------------------------------------
s = Svg(760, 400, "A short timeline of artificial intelligence, from 1950 to 2022.",
        "Timeline: 1950, Alan Turing asks whether machines can think; 1956, the term artificial intelligence is coined at the Dartmouth workshop; 1997, IBM's Deep Blue beats chess champion Garry Kasparov; 2012, deep learning wins an image recognition contest by a large margin; 2017, the transformer design is published, the basis of modern language models; 2022, ChatGPT is released to the public and AI chat reaches millions of people.")
s.text(16, 28, "70 years in six steps", 14, INK, 700)
s.line(20, 200, 740, 200, GOLD_DARK, 3)
events = [
    ("1950", "Alan Turing asks: can machines think?", "He proposes a test based on conversation alone."),
    ("1956", "The name is born", "Researchers at a Dartmouth College workshop coin “artificial intelligence”."),
    ("1997", "A computer beats the chess champion", "IBM's Deep Blue defeats world champion Garry Kasparov."),
    ("2012", "Deep learning takes off", "A neural network wins an image contest by a wide margin."),
    ("2017", "The transformer", "A design that reads whole sentences at once. Modern chatbots use it."),
    ("2022", "AI chat reaches everyone", "ChatGPT launches. Millions try an AI assistant."),
]
for i, (yr, head, body) in enumerate(events):
    x = 70 + i * 124
    s.circle(x, 200, 9, GOLD, GOLD_DARK, 2)
    up = i % 2 == 0
    ty = 44 if up else 224
    s.rect(x - 58, ty, 116, 134, "#FFFFFF", GOLD_DARK, 8, 1)
    s.text(x - 50, ty + 20, yr, 14, GOLD_DARK, 700)
    n = s.text(x - 50, ty + 38, head, 11, INK, 700, wrap=19, lead=13)
    s.text(x - 50, ty + 38 + n * 13 + 4, body, 9.5, MUTED, 400, wrap=24, lead=11.5)
    s.line(x, 200 - (9 if up else -9), x, ty + (134 if up else 0), GOLD_DARK, 1.2)
s.text(16, 390, "Progress came in waves: more data, faster computers and better designs. It was not one invention.", 11, MUTED)
s.save("ai-timeline.svg")

# 3. Kinds of AI by the job they do ---------------------------------------------------------------------------
s = Svg(760, 420, "Six kinds of AI by the job they do, with everyday examples.",
        "Six boxes: predicting, such as fraud alerts and weather forecasts; recognising, such as face unlock and reading text from photos; recommending, such as the videos and products you are shown; understanding speech and language, such as voice typing and translation; generating, such as ChatGPT writing and image makers; and acting, AI agents that carry out steps for you.")
s.text(16, 28, "What is the AI doing?", 14, INK, 700)
boxes = [
    ("Predicting", "Uses past data to guess what comes next.", "Fraud alerts, delivery time estimates, forecasts", BLUE, BLUE_PALE),
    ("Recognising", "Finds things in pictures, sound and video.", "Face unlock, reading text from a photo, spotting damage", GREEN, GREEN_PALE),
    ("Recommending", "Chooses what to show you next.", "Videos you see, products suggested, music playlists", GOLD_DARK, GOLD_PALE),
    ("Understanding speech and language", "Turns speech and text into meaning, and back.", "Voice typing, translation, subtitles", BLUE, BLUE_PALE),
    ("Generating", "Creates new text, images, audio, video or code.", "ChatGPT, Claude, Gemini, image generators", RED, RED_PALE),
    ("Acting", "Plans and carries out steps toward a goal, with tools.", "AI agents that search, fill forms or book for you", GREEN, GREEN_PALE),
]
for i, (h, d, e, c, bgc) in enumerate(boxes):
    x = 16 + (i % 3) * 248
    y = 46 + (i // 3) * 182
    s.rect(x, y, 232, 166, bgc, c, 10)
    s.text(x + 14, y + 26, h, 13.5, c, 700, wrap=26, lead=16)
    s.text(x + 14, y + 66, d, 12, INK, 400, wrap=32, lead=15)
    s.line(x + 14, y + 112, x + 218, y + 112, c, 1)
    s.text(x + 14, y + 130, e, 11, INK, 600, wrap=36, lead=14)
s.text(16, 412, "One product can do several jobs. A phone assistant recognises speech, understands it and then generates a reply.", 11, MUTED)
s.save("ai-types.svg")

# 4. How a language model picks the next word -------------------------------------------------------------------
s = Svg(760, 400, "How a language model writes: it predicts the next word, again and again.",
        "A sentence, 'Lagos traffic is very', and a bar chart of the model's guesses for the next word: bad 38 percent, heavy 24 percent, slow 15 percent, unpredictable 9 percent, and many others sharing the rest. It picks one, adds it to the sentence, and repeats for the next word. The model does not look up facts; it follows patterns from the text it learned from.")
s.text(16, 28, "A language model plays one game, over and over: what word comes next?", 14, INK, 700)
s.rect(16, 48, 728, 52, "#FFFFFF", GOLD_DARK, 10, 1)
s.text(34, 82, "“Lagos traffic is very ___”", 20, INK, 700)
bars = [("bad", 38), ("heavy", 24), ("slow", 15), ("unpredictable", 9), ("…and thousands more", 14)]
for i, (w, p) in enumerate(bars):
    y = 124 + i * 40
    s.text(40, y + 17, w, 13, INK, 600)
    s.rect(210, y, 440 * p / 40, 26, GOLD if i == 0 else GOLD_PALE, GOLD_DARK, 5, 1)
    s.text(216 + 440 * p / 40, y + 18, f"{p}%", 12, GOLD_DARK, 700)
s.text(16, 340, "It picks a likely word (not always the likeliest), adds it to the sentence, and starts again.", 12.5, INK, 600)
s.text(16, 362, "It does not look the answer up or know what is true. It follows patterns from the huge amount of writing it learned from.", 12, MUTED)
s.text(16, 384, "That is why it writes fluently, and why it can sound sure while being wrong. The percentages here are illustrative.", 12, MUTED)
s.save("llm-next-word.svg")

# 5. The prompt framework ---------------------------------------------------------------------------------------
s = Svg(760, 520, "The seven steps of a strong prompt: role, context, task, rules, format, example and check.",
        "A seven-step checklist. 1 Role: who the AI should act as. 2 Context: the situation, the audience, the facts. 3 Task: the one thing you want done. 4 Rules: what must and must not happen, such as length, tone and things to avoid. 5 Format: how the answer should look, such as a table, a list or a number of words. 6 Example: show what good looks like. 7 Check: ask it to ask questions, point out gaps, and then you verify.")
s.text(16, 28, "Seven steps to a strong prompt", 15, INK, 700)
steps = [
    ("1", "Role", "Who should the AI act as?", "“Act as a friendly small-business marketing coach.”"),
    ("2", "Context", "What is the situation, and who is it for?", "“I run a juice shop in Ibadan. Customers are students.”"),
    ("3", "Task", "The one thing you want done.", "“Write three WhatsApp messages announcing weekend delivery.”"),
    ("4", "Rules", "What must, and must not, happen.", "“Under 40 words each. No emojis. Do not promise delivery times.”"),
    ("5", "Format", "How should the answer look?", "“A table: message, best time to send, why.”"),
    ("6", "Example", "Show what good looks like.", "“Here is a message our customers liked: …”"),
    ("7", "Check", "Make it safer and better.", "“Ask me any questions first. List what you are unsure about.”"),
]
for i, (n, h, q, e) in enumerate(steps):
    y = 44 + i * 63
    col = GOLD_DARK if i % 2 == 0 else GREEN
    s.circle(40, y + 26, 20, col)
    s.text(40, y + 32, n, 17, "#FFFFFF", 700, "middle")
    s.rect(72, y + 2, 672, 54, "#FFFFFF", col, 8, 1.2)
    s.text(88, y + 24, h, 14, col, 700)
    s.text(88, y + 44, q, 12, INK, 400)
    s.text(300, y + 33, e, 12, MUTED, 400, wrap=58, lead=15)
s.text(16, 504, "Not every prompt needs all seven. Use the ones that matter for the job, and always add a check for work that counts.", 11, MUTED)
s.save("prompt-framework.svg")

# 6. The worked example, step by step ---------------------------------------------------------------------------
s = Svg(760, 330, "A complete example: eight steps from a problem to finished work with an AI assistant.",
        "Eight steps in two rows: 1 Decide the goal yourself. 2 Brief the AI and let it ask questions. 3 Get options. 4 Choose and shape one. 5 Check the numbers by hand. 6 Ask the AI to criticise its own work. 7 Fix the facts only you know. 8 Decide, publish and learn what worked. A human makes the decisions at steps 1, 4, 5, 7 and 8.")
s.text(16, 28, "The same pattern works for most jobs", 14, INK, 700)
labels = [
    ("1", "Decide the goal", "You", GOLD_DARK),
    ("2", "Brief the AI, let it ask questions", "You + AI", GREEN),
    ("3", "Get options", "AI", GREEN),
    ("4", "Choose and shape one", "You", GOLD_DARK),
    ("5", "Check the numbers by hand", "You", GOLD_DARK),
    ("6", "Ask the AI to criticise it", "AI", GREEN),
    ("7", "Fix what only you know", "You", GOLD_DARK),
    ("8", "Decide, use it, learn", "You", GOLD_DARK),
]
for i, (n, t, who, c) in enumerate(labels):
    x = 16 + (i % 4) * 184
    y = 50 + (i // 4) * 130
    s.rect(x, y, 168, 104, "#FFFFFF", c, 10, 1.5)
    s.circle(x + 24, y + 26, 14, c)
    s.text(x + 24, y + 31, n, 14, "#FFFFFF", 700, "middle")
    s.text(x + 46, y + 31, who, 11, c, 700)
    s.text(x + 14, y + 62, t, 12.5, INK, 600, wrap=22, lead=15)
    if i % 4 < 3:
        s.line(x + 168, y + 52, x + 184, y + 52, MUTED, 1.5, True)
s.line(700, 154, 700, 180, MUTED, 1.5)
s.text(16, 318, "You make the decisions (gold). The AI does the drafting, listing and criticising (green).", 11.5, MUTED)
s.save("worked-example-steps.svg")
