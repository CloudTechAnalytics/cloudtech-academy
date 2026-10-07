"""Builds the 50-post pack: an image for each post (PNG, 1080 x 1350, the 4:5 feed size), the captions, a posting plan, a
spreadsheet (CSV) and an offline gallery page with copy buttons.

    python marketing/posts/build_posts.py            # everything
    python marketing/posts/build_posts.py 7 12 40    # only those post numbers

Needs Chrome or Chromium (set CHROME to its path if it is not found). The fonts are in marketing/ads/fonts.
Edit the wording in posts_data.py, and the look in the CSS and layout functions below.
"""
import csv
import html
import os
import subprocess
import sys
from pathlib import Path
from urllib.parse import quote

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from posts_data import POSTS, U  # noqa: E402

PNG = HERE / "png"
PAGES = HERE / "html"
PNG.mkdir(exist_ok=True)
PAGES.mkdir(exist_ok=True)

CHROME = os.environ.get("CHROME")
if not CHROME:
    for c in (r"C:\Program Files\Google\Chrome\Application\chrome.exe", r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"):
        if Path(c).exists():
            CHROME = c
            break
    else:
        base = Path(os.environ.get("LOCALAPPDATA", "")) / "ms-playwright"
        found = sorted(base.glob("chromium-*/chrome-win*/chrome.exe"))
        CHROME = str(found[0]) if found else "chrome"

W, H = 1080, 1350

THEMES = {
    "dark": dict(bg="#1E1D1B", fg="#FFFFFF", accent="#C9A45C", muted="#E6DECB", card="#2A2825", cardb="#3E3A34", pill="#C9A45C", pillfg="#1E1D1B", chip="#2E2C28", chipfg="#E6DECB", logo2="#4A4640", logotxt="#FFFFFF", logosub="#C9A45C", grid="rgba(201,164,92,.07)", glow="rgba(201,164,92,.28)"),
    "light": dict(bg="#FBF8F2", fg="#1E1D1B", accent="#8A6A1F", muted="#5E5A52", card="#FFFFFF", cardb="#E4D9C3", pill="#1E1D1B", pillfg="#FFFFFF", chip="#F3EBD8", chipfg="#8A6A1F", logo2="#D9CDB8", logotxt="#1E1D1B", logosub="#8A6A1F", grid="rgba(179,138,62,.10)", glow="rgba(201,164,92,.22)"),
    "gold": dict(bg="#C9A45C", fg="#1E1D1B", accent="#1E1D1B", muted="#3B3326", card="#F3EBD8", cardb="#B38A3E", pill="#1E1D1B", pillfg="#E8CF96", chip="#1E1D1B", chipfg="#E8CF96", logo2="#7A5F28", logotxt="#1E1D1B", logosub="#3B3326", grid="rgba(30,29,27,.08)", glow="rgba(255,255,255,.25)"),
    "sand": dict(bg="#F3EBD8", fg="#1E1D1B", accent="#8A6A1F", muted="#4A4640", card="#FFFFFF", cardb="#E4D9C3", pill="#1E1D1B", pillfg="#FFFFFF", chip="#1E1D1B", chipfg="#E8CF96", logo2="#D9CDB8", logotxt="#1E1D1B", logosub="#8A6A1F", grid="rgba(179,138,62,.12)", glow="rgba(201,164,92,.25)"),
}

LOGO = '<svg viewBox="0 0 682 682" width="64" height="64"><rect width="170" height="170" rx="30" fill="#C9A45C"/><g style="fill:var(--logo2)"><rect x="256" width="170" height="170" rx="30"/><rect x="512" width="170" height="170" rx="30"/><rect y="256" width="170" height="170" rx="30"/><rect y="512" width="170" height="170" rx="30"/><rect x="256" y="256" width="426" height="426" rx="44"/></g></svg>'
TICK = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'

CSS = """
@font-face { font-family: PF; src: url('../../ads/fonts/playfair-700.woff2'); font-weight: 700; }
@font-face { font-family: IN; src: url('../../ads/fonts/inter.woff2'); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1080px; height: 1350px; overflow: hidden; }
body { font-family: IN, 'Segoe UI', Arial, sans-serif; background: var(--bg); color: var(--fg); position: relative; }
.serif { font-family: PF, Georgia, serif; font-weight: 700; letter-spacing: -0.012em; font-variant-numeric: lining-nums; line-height: 1.04; }
.acc { color: var(--accent); }
.glow { position: absolute; inset: -10%; background: radial-gradient(900px 700px at 90% 0%, var(--glow), transparent 60%); }
.grid { position: absolute; inset: 0; background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px); background-size: 90px 90px; }
.pad { position: absolute; inset: 0; padding: 76px 84px 70px; display: flex; flex-direction: column; }
.logo { display: flex; align-items: center; gap: 18px; }
.logo .w { font-family: PF, serif; font-weight: 700; font-size: 38px; line-height: 1; color: var(--logotxt); }
.logo .s { font-size: 15px; letter-spacing: .34em; font-weight: 600; margin-top: 6px; color: var(--logosub); }
.main { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 20px 0; min-height: 0; }
.kick { font-size: 26px; letter-spacing: .28em; font-weight: 700; text-transform: uppercase; color: var(--accent); margin-bottom: 26px; }
.chip { display: inline-block; align-self: flex-start; border-radius: 999px; background: var(--chip); color: var(--chipfg); font-weight: 700; font-size: 26px; letter-spacing: .06em; text-transform: uppercase; padding: 12px 28px; margin-bottom: 30px; }
.sub { font-size: 38px; line-height: 1.35; color: var(--muted); margin-top: 28px; }
.card { background: var(--card); border: 2px solid var(--cardb); border-radius: 30px; padding: 14px 38px; margin-top: 40px; }
.row { display: flex; align-items: center; gap: 26px; padding: 22px 0; border-bottom: 1px solid var(--cardb); font-size: 38px; font-weight: 600; line-height: 1.25; }
.row:last-child { border-bottom: 0; }
.tick { flex: none; width: 54px; height: 54px; border-radius: 50%; background: var(--accent); color: var(--bg); display: grid; place-items: center; }
.code { background: #26241F; color: #EFE4CC; border-radius: 22px; padding: 30px 34px; font-family: Consolas, 'Courier New', monospace; font-size: 33px; line-height: 1.5; white-space: pre-wrap; margin-top: 34px; border: 2px solid #3E3A34; }
.bul { display: flex; gap: 22px; align-items: flex-start; margin-top: 26px; font-size: 38px; line-height: 1.3; font-weight: 500; }
.bul i { flex: none; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); margin-top: 18px; }
.foot { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 10px; }
.url { font-size: 31px; font-weight: 700; color: var(--fg); }
.cta { display: inline-block; border-radius: 999px; background: var(--pill); color: var(--pillfg); font-weight: 700; font-size: 32px; padding: 22px 44px; }
.label { border: 2px solid var(--accent); color: var(--accent); border-radius: 999px; font-weight: 700; font-size: 22px; letter-spacing: .12em; text-transform: uppercase; padding: 10px 22px; }
.big { font-family: PF, Georgia, serif; font-weight: 700; color: var(--accent); line-height: .95; letter-spacing: -0.02em; }
.panel { border-radius: 30px; padding: 42px 48px; }
.step { display: flex; align-items: center; gap: 30px; margin-top: 34px; }
.step .n { flex: none; width: 96px; height: 96px; border-radius: 50%; background: var(--accent); color: var(--bg); display: grid; place-items: center; font-family: PF, serif; font-weight: 700; font-size: 50px; }
.step .t { font-family: PF, serif; font-weight: 700; font-size: 56px; line-height: 1.05; }
.step .d { font-size: 30px; color: var(--muted); margin-top: 6px; }
.opt { display: flex; align-items: center; gap: 28px; background: var(--card); border: 2px solid var(--cardb); border-radius: 26px; padding: 24px 32px; margin-top: 24px; font-size: 44px; font-weight: 700; }
.opt b { flex: none; width: 72px; height: 72px; border-radius: 50%; background: var(--accent); color: var(--bg); display: grid; place-items: center; font-size: 38px; }
"""


def esc(s):
    return html.escape(s, quote=False)


def rich(text):
    """*word* shows in the accent colour; a newline is a line break."""
    out, gold = "", False
    for i, part in enumerate(text.split("*")):
        if i:
            gold = not gold
        seg = esc(part).replace("\n", "<br>")
        out += f'<span class="acc">{seg}</span>' if gold and seg else seg
    return out


def plain(text):
    return text.replace("*", "").replace("\n", " ")


def tsize(text, big=132):
    n = len(plain(text))
    if n <= 18:
        return big
    if n <= 28:
        return int(big * 0.86)
    if n <= 40:
        return int(big * 0.72)
    if n <= 55:
        return int(big * 0.62)
    return int(big * 0.54)


def title_html(p, big=132, mt=0):
    return f'<div class="serif" style="font-size:{tsize(p["title"], big)}px;margin-top:{mt}px">{rich(p["title"])}</div>'


def body(p):
    L = p["layout"]
    if L == "course":
        rows = "".join(f'<div class="row"><span class="tick">{TICK}</span><span>{esc(x)}</span></div>' for x in p["items"])
        return (
            f'<div class="chip">{esc(p["tag"])}</div>' + title_html(p, 104)
            + f'<div class="sub" style="margin-top:20px">{esc(p["sub"])}</div><div class="card">{rows}</div>'
        )
    if L == "tip":
        h = f'<div class="kick">{esc(p["kicker"])}</div>' + title_html(p, 104)
        if p.get("code"):
            lines = p["code"].count("\n") + 1
            fs = 33 if lines <= 3 else 29
            h += f'<div class="code" style="font-size:{fs}px">{esc(p["code"])}</div>'
        fs = 36 if len(p["items"]) <= 4 else 32
        h += "".join(f'<div class="bul" style="font-size:{fs}px"><i></i><span>{esc(x)}</span></div>' for x in p["items"])
        return h
    if L == "stat":
        bs = 300 if len(p["big"]) <= 6 else 210 if len(p["big"]) <= 10 else 150
        return (
            f'<div class="big" style="font-size:{bs}px">{esc(p["big"])}</div>' + title_html(p, 84, 30)
            + f'<div class="sub">{esc(p["sub"])}</div><div style="margin-top:28px;font-size:26px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--accent)">{esc(p["note"])}</div>'
        )
    if L == "myth":
        return (
            '<div class="panel" style="background:var(--card);border:2px solid var(--cardb)">'
            f'<div class="kick" style="margin-bottom:14px">Myth</div><div style="font-size:50px;font-weight:600;line-height:1.2;color:var(--muted)">“{esc(p["myth"])}”</div></div>'
            '<div class="panel" style="background:var(--accent);color:var(--bg);margin-top:34px">'
            f'<div style="font-size:26px;letter-spacing:.28em;font-weight:800;text-transform:uppercase;margin-bottom:14px">Fact</div><div style="font-size:{40 if len(p["fact"]) < 190 else 36}px;font-weight:600;line-height:1.3">{esc(p["fact"])}</div></div>'
        )
    if L == "list":
        rows = "".join(f'<div class="row"><span class="tick">{TICK}</span><span>{esc(x)}</span></div>' for x in p["items"])
        return title_html(p, 100) + f'<div class="card">{rows}</div>'
    if L == "poll":
        opts = "".join(f'<div class="opt"><b>{"ABCD"[i]}</b><span>{esc(x)}</span></div>' for i, x in enumerate(p["items"]))
        return title_html(p, 110) + f'<div style="margin-top:20px">{opts}</div><div style="margin-top:36px;font-size:34px;font-weight:700;color:var(--accent)">Comment your letter below</div>'
    if L == "steps":
        steps = "".join(f'<div class="step"><div class="n">{i + 1}</div><div><div class="t">{esc(t)}</div><div class="d">{esc(d)}</div></div></div>' for i, (t, d) in enumerate(p["items"]))
        return title_html(p, 100) + steps
    if L == "statement":
        return (
            f'<div class="kick">{esc(p["kicker"])}</div>' + title_html(p, 150)
            + f'<div class="sub">{esc(p["sub"])}</div>'
        )
    raise ValueError(L)


def footer(p):
    cta = {"free": "Start free →", "paid": "See the course →"}.get(p["kind"], "Learn more →")
    if p["layout"] == "course":
        cta = ("Start free →" if p["kind"] == "free" else "See the course →")
    label = {"free": "Free", "paid": "Professional"}.get(p["kind"], "")
    right = f'<span class="label">{label}</span>' if label else ""
    return f'<div class="foot"><div><div class="cta">{cta}</div></div>{right}</div><div class="url" style="margin-top:22px">{U}</div>'


def page(p):
    t = THEMES[p["theme"]]
    css_vars = ":root{" + ";".join(f"--{k}:{v}" for k, v in t.items()) + "}"
    return (
        f"<!doctype html><html><head><meta charset='utf-8'><title>Post {p['n']:02d}</title><style>{css_vars}{CSS}</style></head><body>"
        '<div class="glow"></div><div class="grid"></div><div class="pad">'
        f'<div class="logo">{LOGO}<div><div class="w">CloudTech</div><div class="s">ACADEMY</div></div></div>'
        f'<div class="main">{body(p)}</div>{footer(p)}</div></body></html>'
    )


def render(page_path: Path, png_path: Path):
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", f"--window-size={W},{H}", f"--screenshot={png_path}", page_path.resolve().as_uri()],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120,
    )


# ---------------------------------------------------------------- posting plan: mix the kinds so no two similar posts sit together
def plan():
    groups = {
        "Free course": [i for i, p in enumerate(POSTS) if p["layout"] == "course" and p["kind"] == "free"],
        "Professional course": [i for i, p in enumerate(POSTS) if p["layout"] == "course" and p["kind"] == "paid"],
        "Tip": [i for i, p in enumerate(POSTS) if p["layout"] == "tip"],
        "Student": [i for i, p in enumerate(POSTS) if p["layout"] in ("list", "steps", "statement") and p["kind"] == "free"],
        "Numbers and business": [i for i, p in enumerate(POSTS) if p["layout"] in ("stat", "myth") or (p["layout"] == "steps" and p["kind"] == "paid")],
        "Poll": [i for i, p in enumerate(POSTS) if p["layout"] == "poll"],
    }
    seen = {i for g in groups.values() for i in g}
    rest = [i for i in range(len(POSTS)) if i not in seen]
    groups["Other"] = rest
    order = []
    queues = {k: list(v) for k, v in groups.items() if v}
    while any(queues.values()):
        for k in sorted(queues, key=lambda k: -len(queues[k])):
            if queues[k]:
                order.append((k, queues[k].pop(0)))
    return order


def full_caption(p):
    verb = "Start free" if p["kind"] == "free" else "See the course" if p["kind"] == "paid" else "Learn more"
    return f"{p['caption']}\n\n👉 {verb}: {U}{p['path']}\n\n{p['tags']}"


def tracked(p, source="instagram"):
    sep = "&" if "?" in p["path"] else "?"
    return f"https://{U}{p['path']}{sep}utm_source={source}&utm_medium=organic_social&utm_campaign=post_pack&utm_content=post-{p['n']:02d}"


def main():
    for i, p in enumerate(POSTS):
        p["n"] = i + 1
        p.setdefault("title", "Myth: " + p["myth"] if "myth" in p else "")
        p["file"] = f"png/{p['n']:02d}-{p['layout']}-{p['theme']}.png"
    only = {int(a) for a in sys.argv[1:]}
    for p in POSTS:
        if only and p["n"] not in only:
            continue
        pg = PAGES / f"{p['n']:02d}.html"
        pg.write_text(page(p), encoding="utf-8")
        render(pg, HERE / p["file"])
        print("wrote", p["file"], flush=True)

    order = plan()
    day_of = {idx: d + 1 for d, (_, idx) in enumerate(order)}
    slots = ["12:30", "19:30"]
    # captions.md
    md = [
        "# CloudTech Academy: 50 social media posts",
        "",
        "Each post has an image (in `png/`), a caption, a link and alt text. Post them in any order, or follow `posting-plan.md`.",
        "",
        "- **Instagram** does not make links in captions clickable: put the link in your bio, or in a link sticker on a Story, and say 'link in bio' in the caption.",
        "- **Facebook, LinkedIn and WhatsApp status** can use the link in the caption. Change `utm_source=instagram` to `facebook`, `linkedin` or `whatsapp` in the tracked link so you can see which platform brings visitors.",
        "- Posts about **professional courses** show no price. Before you post one, check that the course's enrolment is open in the admin, or visitors will see 'Enrolment opens soon'.",
        "",
    ]
    for p in POSTS:
        md += [
            f"## {p['n']:02d}. {plain(p['title'])}",
            "",
            f"Image: `{p['file']}` · Type: {p['layout']} · {'Free course' if p['kind'] == 'free' else 'Professional course' if p['kind'] == 'paid' else 'General'} · Day {day_of[p['n'] - 1]} in the plan",
            "",
            "Caption:",
            "",
            "```",
            full_caption(p),
            "```",
            "",
            f"Tracked link: `{tracked(p)}`",
            "",
            f"Alt text: {p['alt']}",
            "",
        ]
    (HERE / "captions.md").write_text("\n".join(md), encoding="utf-8")

    # posting-plan.md
    pm = ["# Posting plan: one post a day for 50 days", "", "Mixes the kinds of post so that similar ones are not next to each other. Suggested times are Nigerian time (WAT); test others and keep what works.", "",
          "| Day | Time | Post | Type | Image |", "|---|---|---|---|---|"]
    for d, (grp, idx) in enumerate(order):
        p = POSTS[idx]
        pm.append(f"| {d + 1} | {slots[d % 2]} | {p['n']:02d}. {plain(p['title'])} | {grp} | `{p['file']}` |")
    pm += ["", "Tips:", "- Reply to every comment in the first hour. It helps the post and it is where the conversations start.", "- Re-share the best posts as Stories, and the polls on WhatsApp status.", "- After two weeks, look at which types got the most saves, shares and link clicks, and make more of those."]
    (HERE / "posting-plan.md").write_text("\n".join(pm) + "\n", encoding="utf-8")

    # posts.csv (UTF-8 with a byte order mark so Excel reads the naira sign)
    with open(HERE / "posts.csv", "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["post", "plan_day", "suggested_time", "image_file", "type", "audience", "caption_with_link_and_hashtags", "tracked_link", "alt_text"])
        for p in POSTS:
            d = day_of[p["n"] - 1]
            w.writerow([p["n"], d, slots[(d - 1) % 2], p["file"], p["layout"], {"free": "Free course", "paid": "Professional course"}.get(p["kind"], "General"), full_caption(p), tracked(p), p["alt"]])

    # gallery
    cards = []
    for p in POSTS:
        cards.append(
            f'<article class="card" data-kind="{p["kind"]}"><img loading="lazy" src="{quote(p["file"])}" alt="{html.escape(p["alt"], quote=True)}">'
            f'<div class="meta"><b>{p["n"]:02d}. {esc(plain(p["title"]))}</b><span>Day {day_of[p["n"] - 1]} · {"Free" if p["kind"] == "free" else "Professional" if p["kind"] == "paid" else "General"}</span></div>'
            f'<textarea readonly rows="7">{esc(full_caption(p))}</textarea>'
            f'<div class="btns"><button onclick="copyCap(this)">Copy caption</button><a download href="{quote(p["file"])}">Download image</a></div></article>'
        )
    gallery = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CloudTech Academy: 50 posts</title>
<style>
body{{font-family:Segoe UI,Arial,sans-serif;background:#FBF8F2;color:#1E1D1B;margin:0;padding:24px}}
h1{{font-family:Georgia,serif;margin:0 0 6px}} p.n{{color:#5E5A52;max-width:60rem;margin:0 0 18px}}
.bar{{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap}} .bar button{{border:1px solid #CFC4B2;background:#fff;border-radius:999px;padding:8px 16px;cursor:pointer;font-weight:600}} .bar button.on{{background:#1E1D1B;color:#fff}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}}
.card{{background:#fff;border:1px solid #E4D9C3;border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:10px}}
.card img{{width:100%;border-radius:10px;aspect-ratio:4/5;object-fit:cover;background:#eee}}
.meta{{display:flex;flex-direction:column;gap:2px;font-size:14px}} .meta span{{color:#8A6A1F;font-size:12px;font-weight:600}}
textarea{{width:100%;font:13px/1.4 Segoe UI,Arial,sans-serif;border:1px solid #E4D9C3;border-radius:8px;padding:8px;resize:vertical;box-sizing:border-box}}
.btns{{display:flex;gap:8px}} .btns button,.btns a{{flex:1;text-align:center;background:#8A6A1F;color:#fff;border:0;border-radius:10px;padding:10px;font-weight:600;font-size:14px;cursor:pointer;text-decoration:none}} .btns a{{background:#1E1D1B}}
</style></head><body>
<h1>CloudTech Academy: 50 posts</h1>
<p class="n">Copy the caption, download the image and post. Instagram does not make caption links clickable, so put the link in your bio. See <b>posting-plan.md</b> for the order and <b>captions.md</b> for tracked links and alt text.</p>
<div class="bar"><button class="on" data-f="all">All 50</button><button data-f="free">Free courses</button><button data-f="paid">Professional courses</button><button data-f="general">General</button></div>
<div class="grid">{''.join(cards)}</div>
<script>
function copyCap(b){{const t=b.closest('.card').querySelector('textarea');t.select();(navigator.clipboard?navigator.clipboard.writeText(t.value):Promise.reject()).catch(()=>document.execCommand('copy')).then(()=>{{b.textContent='Copied';setTimeout(()=>b.textContent='Copy caption',1400)}})}}
document.querySelectorAll('.bar button').forEach(b=>b.onclick=()=>{{document.querySelectorAll('.bar button').forEach(x=>x.classList.remove('on'));b.classList.add('on');const f=b.dataset.f;document.querySelectorAll('.card').forEach(c=>c.style.display=(f==='all'||c.dataset.kind===f)?'':'none')}});
</script></body></html>"""
    (HERE / "index.html").write_text(gallery, encoding="utf-8")
    print("wrote captions.md, posting-plan.md, posts.csv, index.html")


if __name__ == "__main__":
    main()
