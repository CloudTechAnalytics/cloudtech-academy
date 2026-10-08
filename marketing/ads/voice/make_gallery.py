"""Writes index.html next to this file: every video in out/ with a player, the script and a download link.
Double-click index.html to watch them all (it works offline). Run: python marketing/ads/voice/make_gallery.py
"""
import html
from pathlib import Path

ROOT = Path(__file__).resolve().parent
import sys

sys.path.insert(0, str(ROOT))
from specs import VIDEOS  # noqa: E402

cards = []
for v in VIDEOS:
    f = ROOT / "out" / f"{v['id']}-{v['fmt']}.mp4"
    if not f.exists():
        continue
    vo = " ".join(s["vo"] for s in v["scenes"])
    mb = f.stat().st_size / 1e6
    cards.append(
        f'<article><video controls preload="metadata" playsinline src="out/{f.name}"></video>'
        f'<h3>{html.escape(v["id"][:2])}. {html.escape(v["title"])}</h3>'
        f'<p class="m">{v["fmt"].replace("x", ":")} · {v["voice"].split("-")[2].replace("Neural", "")} ({"female" if v["voice"] in ("en-US-AvaNeural", "en-NG-EzinneNeural") else "male"}) · {mb:.1f} MB</p>'
        f'<p class="u">{html.escape(v["use"])}</p><details><summary>Voice-over script</summary><p>{html.escape(vo)}</p></details>'
        f'<a download href="out/{f.name}">Download</a></article>'
    )

page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CloudTech Academy: voice-over videos</title><style>
body{{font-family:Segoe UI,Arial,sans-serif;background:#FBF8F2;color:#1E1D1B;margin:0;padding:24px}}
h1{{font-family:Georgia,serif;margin:0 0 6px}}.n{{color:#5E5A52;max-width:60rem}}
.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:20px;margin-top:20px}}
article{{background:#fff;border:1px solid #E4D9C3;border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:6px}}
video{{width:100%;max-height:480px;background:#000;border-radius:10px}}h3{{margin:6px 0 0;font-size:16px}}
.m{{color:#8A6A1F;font-size:12px;font-weight:600;margin:0}}.u{{font-size:13px;margin:0;color:#5E5A52}}
details{{font-size:13px}}summary{{cursor:pointer;color:#8A6A1F;font-weight:600}}
a{{margin-top:auto;text-align:center;background:#1E1D1B;color:#fff;border-radius:10px;padding:10px;font-weight:600;text-decoration:none}}
</style></head><body><h1>CloudTech Academy: voice-over videos</h1>
<p class="n">{len(cards)} videos with Nigerian English voices and on-screen captions. Press play to watch, or Download to post. Scripts and ad copy are in README.md.</p>
<div class="g">{''.join(cards)}</div></body></html>"""
(ROOT / "index.html").write_text(page, encoding="utf-8")
print("wrote index.html with", len(cards), "videos")
