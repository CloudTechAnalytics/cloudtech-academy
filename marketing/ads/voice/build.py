"""Builds the voice-over ad videos.

    python marketing/ads/voice/build.py all            # every video
    python marketing/ads/voice/build.py 03-sql-in-browser 04-students-start-here

For each video: the voice (Microsoft neural text to speech, American English by default; Nigerian English with VOICE_SET=ng, through the edge-tts package) is generated
scene by scene, the scene lengths follow the speech, the page in template.html is stepped frame by frame in Chrome
(through marketing/ads/video/render-video.cjs), and ffmpeg adds the voice. Output goes to marketing/ads/voice/out/.

Needs: pip install edge-tts imageio-ffmpeg, Playwright, and Chrome. Set CHROME, PLAYWRIGHT_PATH and FFMPEG if they are not
found. The text of each script is sent to Microsoft's online voice service to be turned into speech.
"""
import asyncio
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
from specs import VIDEOS  # noqa: E402

FF = os.environ.get("FFMPEG")
if not FF:
    import imageio_ffmpeg

    FF = imageio_ffmpeg.get_ffmpeg_exe()
CHROME = os.environ.get("CHROME", r"C:\Program Files\Google\Chrome\Application\chrome.exe")
PLAYWRIGHT = os.environ.get("PLAYWRIGHT_PATH", r"C:\Users\user\AppData\Local\npm-cache\_npx\e41f203b7505f1fb\node_modules\playwright")
FPS = 30
LEAD = 0.25  # seconds of quiet before each scene's voice
TAIL = 0.55  # seconds after it

# size, padding and logo position for each format (u scales every font and size on the page)
FORMATS = {
    "9x16": dict(W=1080, H=1920, U=1.0, PADX=84, PADT=330, PADB=560, MAXW=912, CAPB=360, LOGOTOP=210),
    "1x1": dict(W=1080, H=1080, U=0.74, PADX=84, PADT=190, PADB=250, MAXW=912, CAPB=60, LOGOTOP=60),
    "16x9": dict(W=1920, H=1080, U=0.78, PADX=130, PADT=190, PADB=250, MAXW=1500, CAPB=56, LOGOTOP=60),
}
SPOKEN_TO_WRITTEN = [(r"\bA I\b", "AI"), (r"\bC V\b", "CV"), (r"\bS Q L\b", "SQL"), (r"Power B I", "Power BI")]


def seconds(path: Path) -> float:
    r = subprocess.run([FF, "-i", str(path)], capture_output=True, text=True)
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", r.stderr)
    return int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"{cmd[0]} failed:\n{r.stderr[-1500:]}")


async def speak(text: str, voice: str, out: Path):
    await edge_tts.Communicate(text, voice, rate="+4%").save(str(out))


def captions(vo: str):
    """The narration as short caption chunks (about 3 to 8 words), split at punctuation where it can."""
    text = vo
    for a, b in SPOKEN_TO_WRITTEN:
        text = re.sub(a, b, text)
    chunks = []
    for sent in re.split(r"(?<=[.?!])\s+", text.strip()):
        parts = re.split(r"(?<=,)\s+", sent)
        for p in parts:
            words = p.split()
            while len(words) > 8:
                chunks.append(" ".join(words[:6]))
                words = words[6:]
            if words:
                chunks.append(" ".join(words))
    # merge very short chunks into the one before
    out = []
    for c in chunks:
        if out and len(c.split()) < 3 and len(out[-1].split()) + len(c.split()) <= 9:
            out[-1] += " " + c
        else:
            out.append(c)
    return out


def build(spec):
    vid = spec["id"]
    work = ROOT / "build" / vid
    work.mkdir(parents=True, exist_ok=True)
    (ROOT / "out").mkdir(exist_ok=True)
    (ROOT / "pages").mkdir(exist_ok=True)
    fmt = FORMATS[spec["fmt"]]

    # 1. the voice, one file per scene
    t = 0.0
    scenes = []
    for i, sc in enumerate(spec["scenes"]):
        mp3 = work / f"s{i}.mp3"
        asyncio.run(speak(sc["vo"], spec["voice"], mp3))
        d = seconds(mp3)
        length = max(LEAD + d + TAIL, 3.2)
        if i == len(spec["scenes"]) - 1:
            length += 0.6
        scenes.append(dict(sc, start=round(t, 3), end=round(t + length, 3), audio=round(d, 3), length=length, last=(i == len(spec["scenes"]) - 1), chunks=captions(sc["vo"]), mp3=str(mp3)))
        t += length
    total = round(t, 3)

    # 2. the sound track: each scene's speech, delayed and padded to the scene length, joined, with even loudness
    wavs = []
    for i, sc in enumerate(scenes):
        wav = work / f"s{i}.wav"
        run([FF, "-y", "-hide_banner", "-loglevel", "error", "-i", sc["mp3"], "-af", f"adelay={int(LEAD * 1000)}:all=1,apad=whole_dur={sc['length']:.3f}", "-ar", "44100", "-ac", "1", "-t", f"{sc['length']:.3f}", str(wav)])
        wavs.append(wav)
    listing = work / "list.txt"
    listing.write_text("".join(f"file '{w.as_posix()}'\n" for w in wavs))
    voice = work / "voice.wav"
    run([FF, "-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(listing), "-af", "loudnorm=I=-16:TP=-1.5:LRA=9", "-ar", "44100", "-ac", "1", str(voice)])

    # 3. the page, and the silent video
    spec_js = dict(duration=total, scenes=[{k: v for k, v in sc.items() if k not in ("mp3", "length")} for sc in scenes])
    html = (ROOT / "template.html").read_text(encoding="utf-8")
    for k in ("W", "H", "U", "PADX", "PADT", "PADB", "MAXW", "CAPB", "LOGOTOP"):
        html = html.replace(f"__{k}__", str(fmt[k]))
    html = html.replace("__TITLE__", spec["title"]).replace("__SPEC__", json.dumps(spec_js, ensure_ascii=False))
    page = ROOT / "pages" / f"{vid}.html"
    page.write_text(html, encoding="utf-8")
    silent = work / "silent.mp4"
    env = dict(os.environ, CHROME=CHROME, PLAYWRIGHT_PATH=PLAYWRIGHT, FFMPEG=FF)
    r = subprocess.run(["node", str(ROOT.parent / "video" / "render-video.cjs"), str(page), str(silent), str(fmt["W"]), str(fmt["H"]), str(FPS)], env=env)
    if r.returncode != 0:
        raise RuntimeError("render failed")

    # 4. voice and picture together
    out = ROOT / "out" / f"{vid}-{spec['fmt']}.mp4"
    run([FF, "-y", "-hide_banner", "-loglevel", "error", "-i", str(silent), "-i", str(voice), "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", str(out)])
    print(f"done {out.name}: {total:.1f}s, {out.stat().st_size / 1e6:.1f} MB", flush=True)
    return out


if __name__ == "__main__":
    want = sys.argv[1:] or ["all"]
    todo = VIDEOS if "all" in want else [v for v in VIDEOS if v["id"] in want]
    if not todo:
        sys.exit("no such video; ids: " + ", ".join(v["id"] for v in VIDEOS))
    for v in todo:
        build(v)
