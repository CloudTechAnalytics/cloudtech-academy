"""Pulls frames from a video at the given seconds into one image, to review it without playing it.
python contact-sheet.py <video.mp4> <out.png> <seconds,seconds,...> [thumb_width]"""
import subprocess, sys, os, tempfile
from pathlib import Path
from PIL import Image
video, out, times = sys.argv[1], sys.argv[2], [float(x) for x in sys.argv[3].split(",")]
tw = int(sys.argv[4]) if len(sys.argv) > 4 else 360
ff = os.environ.get("FFMPEG", "ffmpeg")
tmp = Path(tempfile.mkdtemp())
ims = []
for i, t in enumerate(times):
    f = tmp / f"{i}.png"
    subprocess.run([ff, "-y", "-loglevel", "error", "-ss", str(t), "-i", video, "-frames:v", "1", str(f)], check=True)
    im = Image.open(f)
    ims.append(im.resize((tw, int(im.height * tw / im.width))))
sheet = Image.new("RGB", (sum(i.width for i in ims) + 10 * (len(ims) - 1), max(i.height for i in ims)), "#888")
x = 0
for im in ims:
    sheet.paste(im, (x, 0))
    x += im.width + 10
sheet.save(out)
