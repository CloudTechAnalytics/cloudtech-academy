"""Builds the static ad designs: 6 concepts in 4 sizes, as HTML and PNG.

Run:  python marketing/ads/build_static.py
Needs Chrome or Chromium (set CHROME to its path) and the fonts in marketing/ads/fonts.
Output: marketing/ads/static/<concept>-<size>.html and .png
Sizes: feed 4:5 (1080x1350), square (1080x1080), story/reel 9:16 (1080x1920), link 1.91:1 (1200x628).
Stories keep text out of the top 210px and bottom 330px, where the app draws its own buttons.
"""
import os
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "static"
OUT.mkdir(exist_ok=True)
CHROME = os.environ.get("CHROME")
if not CHROME:
    base = Path(os.environ.get("LOCALAPPDATA", "")) / "ms-playwright"
    found = sorted(base.glob("chromium-*/chrome-win*/chrome.exe"))
    CHROME = str(found[0]) if found else "chrome"

URL = "academy.cloudtechanalytics.com"

SIZES = {
    "feed": dict(w=1080, h=1350, pad=84, head=112, sub=38, z=1.0, split=False, logo=1.0),
    "square": dict(w=1080, h=1080, pad=64, head=88, sub=31, z=0.8, split=False, logo=0.8),
    "story": dict(w=1080, h=1920, pad=84, head=128, sub=42, z=1.0, split=False, logo=1.0),
    "link": dict(w=1200, h=628, pad=44, head=58, sub=21, z=0.5, split=True, logo=0.62),
}

LOGO = '<svg viewBox="0 0 682 682" width="64" height="64"><rect width="170" height="170" rx="30" fill="#C9A45C"/><g fill="#4A4640"><rect x="256" width="170" height="170" rx="30"/><rect x="512" width="170" height="170" rx="30"/><rect y="256" width="170" height="170" rx="30"/><rect y="512" width="170" height="170" rx="30"/><rect x="256" y="256" width="426" height="426" rx="44"/></g></svg>'

CHECK = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'


def badge(color, ring, label, sub, icon):
    return f'''<div style="text-align:center;width:260px">
  <svg viewBox="0 0 200 200" width="230" height="230"><circle cx="100" cy="100" r="92" fill="{ring}"/><circle cx="100" cy="100" r="80" fill="{color}"/><circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2" stroke-dasharray="3 6"/>{icon}</svg>
  <div class="serif" style="font-size:30px;margin-top:6px;line-height:1.15">{label}</div><div style="font-size:21px;opacity:.7;margin-top:4px">{sub}</div></div>'''


ICON_DB = '<g fill="none" stroke="#1E1D1B" stroke-width="7" stroke-linecap="round"><ellipse cx="100" cy="76" rx="34" ry="13"/><path d="M66 76v48c0 7 15 13 34 13s34-6 34-13V76"/><path d="M66 100c0 7 15 13 34 13s34-6 34-13"/></g>'
ICON_XL = '<g fill="none" stroke="#1E1D1B" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><rect x="64" y="64" width="72" height="72" rx="8"/><path d="M64 88h72M64 112h72M88 64v72"/></g>'
ICON_PY = '<g fill="none" stroke="#1E1D1B" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><path d="M82 74l-24 26 24 26M118 74l24 26-24 26"/></g>'


def visual(concept):
    """The picture for each concept, drawn at a base width of 900px and scaled by the size's zoom."""
    if concept == "free-data":
        rows = [("Excel for Data Analysis", "Formulas, pivot tables, charts"), ("SQL for Data Analysis", "Query real company data"), ("Power BI Fundamentals", "Build dashboards people use"), ("Python for Beginners", "From your first line of code")]
        items = "".join(
            f'<div style="display:flex;align-items:center;gap:22px;padding:24px 28px;border-bottom:1px solid rgba(255,255,255,.12)"><span style="color:#C9A45C">{CHECK}</span><div style="flex:1"><div style="font-weight:700;font-size:30px">{t}</div><div style="opacity:.65;font-size:22px;margin-top:3px">{s}</div></div><span class="pill" style="background:#C9A45C;color:#1E1D1B;padding:7px 18px;font-size:20px">FREE</span></div>'
            for t, s in rows
        )
        return f'<div style="width:900px;border-radius:30px;background:#2A2825;border:2px solid #3E3A34;overflow:hidden;color:#fff">{items}</div>'
    if concept == "sql-browser":
        return '''<div style="width:900px;border-radius:26px;overflow:hidden;box-shadow:0 40px 80px -40px rgba(30,29,27,.55);border:2px solid #1E1D1B">
  <div style="background:#1E1D1B;display:flex;justify-content:space-between;align-items:center;padding:16px 26px;color:#C9A45C;font-weight:700;font-size:22px"><span>Practice</span><span style="background:#C9A45C;color:#1E1D1B;border-radius:10px;padding:8px 18px;font-size:20px">Run and check</span></div>
  <pre style="margin:0;background:#26241F;color:#EFE4CC;padding:30px 30px;font-family:Consolas,'Courier New',monospace;font-size:29px;line-height:1.5"><span style="color:#C9A45C">SELECT</span> customer, <span style="color:#C9A45C">SUM</span>(total) <span style="color:#C9A45C">AS</span> revenue
<span style="color:#C9A45C">FROM</span> orders
<span style="color:#C9A45C">WHERE</span> status = <span style="color:#9fd8b0">'paid'</span>
<span style="color:#C9A45C">GROUP BY</span> customer
<span style="color:#C9A45C">ORDER BY</span> revenue <span style="color:#C9A45C">DESC</span>;</pre>
  <div style="background:#E3F2E7;color:#1F6B3A;padding:20px 30px;font-weight:700;font-size:26px;display:flex;gap:14px;align-items:center">''' + CHECK + ''' Correct. Your result matches.</div></div>'''
    if concept == "badges":
        return '<div style="display:flex;gap:34px;justify-content:center;color:#1E1D1B">' + badge("#F3EBD8", "#1E1D1B", "SQL Querying", "Badge earned", ICON_DB) + badge("#FBF8F2", "#1E1D1B", "Pivot Tables", "Badge earned", ICON_XL) + badge("#EFE4CC", "#1E1D1B", "Python Basics", "Badge earned", ICON_PY) + "</div>"
    if concept == "students":
        chips = ["ChatGPT for study", "Research skills", "CV and LinkedIn", "Student portfolio", "Get your first internship", "Excel and Python", "Freelancing basics"]
        return '<div style="width:900px;display:flex;flex-wrap:wrap;gap:16px">' + "".join(
            f'<span class="pill" style="background:{"#C9A45C" if i % 3 == 0 else "#2E2C28"};color:{"#1E1D1B" if i % 3 == 0 else "#E6DECB"};border:2px solid {"#C9A45C" if i % 3 == 0 else "#4A4640"};font-size:30px;padding:16px 30px">{c}</span>' for i, c in enumerate(chips)
        ) + "</div>"
    if concept == "path":
        steps = [("1", "Excel", "Clean and analyse data"), ("2", "SQL", "Ask a database questions"), ("3", "Power BI", "Build a dashboard"), ("4", "Python", "Automate your analysis")]
        rows = "".join(
            f'<div style="display:flex;align-items:center;gap:26px"><div class="serif" style="width:84px;height:84px;border-radius:50%;background:#1E1D1B;color:#C9A45C;display:grid;place-items:center;font-size:42px;flex:none">{n}</div><div style="flex:1;background:#fff;border:2px solid #E4D9C3;border-radius:22px;padding:20px 28px"><div style="font-weight:800;font-size:32px">{t}</div><div style="opacity:.65;font-size:23px;margin-top:2px">{s}</div></div><span class="pill" style="background:#F3EBD8;color:#8A6A1F;font-size:20px;padding:7px 16px">FREE</span></div>'
            for n, t, s in steps
        )
        return f'<div style="width:900px;display:flex;flex-direction:column;gap:20px;color:#1E1D1B">{rows}</div>'
    if concept == "go-further":
        return '''<div style="width:820px;transform:rotate(-2deg);background:#fff;border-radius:22px;overflow:hidden;display:flex;box-shadow:0 40px 80px -30px rgba(0,0,0,.8);color:#1E1D1B">
  <div style="width:34px;background:linear-gradient(180deg,#C9A45C,#1E1D1B 60%)"></div>
  <div style="padding:40px 44px;flex:1"><div style="font-size:19px;letter-spacing:.28em;font-weight:700;color:#8A6A1F">PROFESSIONAL CERTIFICATE</div>
  <div style="font-size:22px;color:#6B665C;margin-top:22px">This is to certify that</div><div class="serif" style="font-size:54px;line-height:1.1">Your Name Here</div>
  <div style="font-size:22px;color:#6B665C;margin-top:8px">has completed the professional programme</div><div class="serif" style="font-size:38px;color:#8A6A1F">Data Analytics</div>
  <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:26px"><span style="font-family:Consolas,monospace;font-size:19px;color:#6B665C">CTA-2026-000124</span><span style="display:inline-block;width:78px;height:78px;border:2px solid #E4D9C3;background:repeating-conic-gradient(#1E1D1B 0 25%,#fff 0 50%) 0 0/26px 26px"></span></div></div></div>'''
    raise SystemExit(concept)


CONCEPTS = {
    "free-data": dict(theme="dark", kicker="Free courses", head='Learn data. <span class="gold">Free.</span>', sub="Excel, SQL, Power BI and Python, taught step by step. Practise in your browser and earn a badge for every skill.", cta="Start learning free"),
    "sql-browser": dict(theme="light", kicker="Practise as you learn", head='Write real SQL <span class="gold">in your browser.</span>', sub="No setup. No downloads. Run your query and see straight away whether your answer is right.", cta="Try the first lesson free"),
    "badges": dict(theme="gold", kicker="Earn as you learn", head="Every skill earns a badge.", sub="Pass the module check and get a badge you can share on LinkedIn. Free with every course.", cta="Start earning badges"),
    "students": dict(theme="dark", kicker="For students", head='Student? <span class="gold">Start here.</span>', sub="Study smarter with AI, build a CV that gets read, and go after your first internship. All free.", cta="Start learning free"),
    "path": dict(theme="light", kicker="A clear route", head='Zero to data analyst. <span class="gold">Start free.</span>', sub="One free course at a time, from spreadsheets to dashboards.", cta="Start the first course"),
    "go-further": dict(theme="dark", kicker="Ready to go further?", head='From learner to <span class="gold">professional.</span>', sub="Professional programmes in data, AI, cloud and software: full curriculum, real projects, a capstone and a certificate.", cta="Explore programmes"),
}

THEMES = {
    "dark": dict(bg="#1E1D1B", fg="#FFFFFF", sub="#E6DECB", kick="#C9A45C", gold="#C9A45C", cta_bg="#C9A45C", cta_fg="#1E1D1B", word="#FFFFFF", wordsub="#C9A45C",
                 deco="radial-gradient(900px 700px at 85% 0%, rgba(201,164,92,.30), transparent 60%), radial-gradient(700px 700px at 0% 100%, rgba(201,164,92,.16), transparent 60%)"),
    "light": dict(bg="#FBF8F2", fg="#1E1D1B", sub="#5B564D", kick="#8A6A1F", gold="#B38A3E", cta_bg="#1E1D1B", cta_fg="#FFFFFF", word="#1E1D1B", wordsub="#8A6A1F",
                  deco="radial-gradient(900px 600px at 90% -10%, rgba(201,164,92,.28), transparent 60%)"),
    "gold": dict(bg="#C9A45C", fg="#1E1D1B", sub="#3A3328", kick="#1E1D1B", gold="#FFFFFF", cta_bg="#1E1D1B", cta_fg="#F3EBD8", word="#1E1D1B", wordsub="#1E1D1B",
                 deco="radial-gradient(800px 600px at 10% 0%, rgba(255,255,255,.35), transparent 60%), radial-gradient(700px 600px at 100% 100%, rgba(30,29,27,.18), transparent 60%)"),
}


# Some pictures are taller than others, so they get their own scale in the tighter sizes.
ZOOM = {("path", "feed"): 0.88, ("path", "square"): 0.56, ("sql-browser", "square"): 0.68, ("free-data", "square"): 0.7, ("go-further", "square"): 0.66, ("sql-browser", "story"): 0.88, ("path", "story"): 0.84, ("free-data", "story"): 0.94, ("badges", "square"): 0.8, ("students", "square"): 0.8}


def page(concept, size):
    c = CONCEPTS[concept]
    t = THEMES[c["theme"]]
    s = SIZES[size]
    size_name = size
    split = s["split"]
    cta = f'<span class="pill cta" style="background:{t["cta_bg"]};color:{t["cta_fg"]}">{c["cta"]} →</span><span class="url" style="color:{t["sub"]}">{URL}</span>'
    text = f'''<div class="kick" style="color:{t["kick"]}">{c["kicker"]}</div>
    <div class="serif head" style="color:{t["fg"]}">{c["head"]}</div>
    <div class="sub" style="color:{t["sub"]}">{c["sub"]}</div>'''
    vis = f'<div class="vis"><div style="zoom:{ZOOM.get((concept, size), s["z"])}">{visual(concept)}</div></div>'
    if split:
        body = f'<div class="row"><div class="col">{text}<div class="ctarow">{cta}</div></div>{vis}</div>'
    else:
        body = f'{text}{vis}<div class="ctarow">{cta}</div>'
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family: PF; src: url('../fonts/playfair-700.woff2'); font-weight: 700; }}
@font-face {{ font-family: IN; src: url('../fonts/inter.woff2'); font-weight: 100 900; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
html, body {{ width: {s["w"]}px; height: {s["h"]}px; overflow: hidden; }}
body {{ font-family: IN, 'Segoe UI', Arial, sans-serif; background: {t["bg"]}; color: {t["fg"]}; position: relative; }}
.deco {{ position: absolute; inset: 0; background: {t["deco"]}; }}
.pad {{ position: absolute; inset: 0; padding: {"210px 84px 330px" if size_name == "story" else str(s["pad"]) + "px"}; display: flex; flex-direction: column; }}
.serif {{ font-family: PF, Georgia, serif; font-weight: 700; letter-spacing: -0.015em; font-variant-numeric: lining-nums; }}
.gold {{ color: {t["gold"]}; }}
.logo {{ display: flex; align-items: center; gap: {18*s["logo"]:.0f}px; }}
.logo svg {{ width: {64*s["logo"]:.0f}px; height: {64*s["logo"]:.0f}px; }}
.logo .w {{ font-family: PF, serif; font-weight: 700; font-size: {38*s["logo"]:.0f}px; line-height: 1; color: {t["word"]}; }}
.logo .s {{ font-size: {15*s["logo"]:.0f}px; letter-spacing: 0.34em; font-weight: 600; margin-top: 6px; color: {t["wordsub"]}; }}
.kick {{ font-size: {max(15, 24*s["logo"]):.0f}px; letter-spacing: 0.3em; font-weight: 700; text-transform: uppercase; }}
.head {{ font-size: {s["head"]}px; line-height: 1.02; margin-top: {26 if not split else 12}px; }}
.sub {{ font-size: {s["sub"]}px; line-height: 1.42; margin-top: {30 if not split else 14}px; max-width: {880 if not split else 520}px; }}
.pill {{ display: inline-block; border-radius: 999px; padding: 12px 26px; font-weight: 700; font-size: 26px; }}
.cta {{ padding: {26*s["logo"]:.0f}px {50*s["logo"]:.0f}px; font-size: {36*s["logo"]:.0f}px; }}
.url {{ font-weight: 700; font-size: {32*s["logo"]:.0f}px; letter-spacing: .01em; }}
.ctarow {{ display: flex; align-items: center; gap: {30*s["logo"]:.0f}px; flex-wrap: wrap; margin-top: auto; padding-top: 36px; }}
.vis {{ margin-top: {44 if not split else 0}px; display: flex; {"justify-content:center;" if not split else ""} {"align-items:center;" if split or size_name == "story" else ""} {"flex:1;" if size_name == "story" else ""} }}
.main {{ margin-top: {50*s["logo"]:.0f}px; display: flex; flex-direction: column; flex: 1; }}
.row {{ display: flex; gap: 40px; flex: 1; align-items: stretch; }}
.col {{ display: flex; flex-direction: column; flex: 1.1; }}
.row .vis {{ flex: 1; }}
.stack {{ flex: 1; display: flex; flex-direction: column; }}
.stack .vis {{ margin-bottom: 40px; }}
</style></head><body>
<div class="deco"></div>
<div class="pad">
  <div class="logo">{LOGO}<div><div class="w">CloudTech</div><div class="s">ACADEMY</div></div></div>
  <div class="main">{body}</div>
</div></body></html>'''


def render(html_path, png_path, w, h):
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", f"--window-size={w},{h}", f"--screenshot={png_path}", html_path.resolve().as_uri()],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


if __name__ == "__main__":
    only = sys.argv[1:]
    for concept in CONCEPTS:
        if only and concept not in only:
            continue
        for size, s in SIZES.items():
            html = OUT / f"{concept}-{size}.html"
            html.write_text(page(concept, size), encoding="utf-8")
            render(html, OUT / f"{concept}-{size}.png", s["w"], s["h"])
            print("wrote", html.stem)
