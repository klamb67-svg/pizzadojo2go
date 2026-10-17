#!/usr/bin/env python3
"""
Build the fast gallery.

Run after adding photos to assets/images/gallery/:
    python3 scripts/build-gallery.py

For every photo it makes (only if missing or out of date):
  assets/images/gallery-web/thumb/<name>.webp   ~400px tall, for the grid
  assets/images/gallery-web/large/<name>.webp   max 1600px, for the full-screen view
and writes assets/images/gallery-web/gallery-data.json, sorted newest first,
with each photo's size and date so the page never has to open the originals.
"""
import io, json, os, re, sys
from datetime import datetime
from PIL import Image, ImageCms, ImageOps

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC = os.path.join(ROOT, 'assets', 'images', 'gallery')
OUT = os.path.join(ROOT, 'assets', 'images', 'gallery-web')
THUMB_H, LARGE_MAX = 400, 1600
EXTS = ('.jpg', '.jpeg', '.png', '.webp')


def photo_date(path, im):
    exif = im.getexif()
    taken = exif.get_ifd(0x8769).get(36867) if exif else None      # DateTimeOriginal
    if taken:
        try:
            return datetime.strptime(taken.strip(), '%Y:%m:%d %H:%M:%S')
        except ValueError:
            pass
    m = re.search(r'(\d{8})[_-]?(\d{6})', os.path.basename(path))  # 20250131_193153, PXL_20250131_193153
    if m:
        try:
            return datetime.strptime(m.group(1) + m.group(2), '%Y%m%d%H%M%S')
        except ValueError:
            pass
    return datetime.fromtimestamp(os.path.getmtime(path))


SRGB = ImageCms.createProfile('sRGB')

def to_srgb(im):
    """iPhone photos are often Display-P3; convert so colors don't look washed out."""
    icc = im.info.get('icc_profile')
    if icc:
        try:
            src = ImageCms.ImageCmsProfile(io.BytesIO(icc))
            return ImageCms.profileToProfile(im, src, SRGB, outputMode='RGB')
        except Exception:
            pass
    if im.mode in ('RGBA', 'LA', 'P'):           # transparent PNG: put it on white, not black
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[3])
        return bg
    return im.convert('RGB')


def save_webp(im, path, quality):
    tmp = path + '.tmp'                         # write then rename, so a killed run never leaves half a file
    im.save(tmp, 'WEBP', quality=quality, method=6)
    os.replace(tmp, path)


def fresh(out, src):
    return os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src)


def main():
    os.makedirs(os.path.join(OUT, 'thumb'), exist_ok=True)
    os.makedirs(os.path.join(OUT, 'large'), exist_ok=True)
    files = sorted(f for f in os.listdir(SRC) if f.lower().endswith(EXTS))
    bases = {}
    for f in files:                              # a.jpg and a.png would both become a.webp
        bases.setdefault(os.path.splitext(f)[0], []).append(f)
    clash = {b: fs for b, fs in bases.items() if len(fs) > 1}
    if clash:
        print('Two photos share a name (rename one):', clash)
        return 1
    items, made = [], 0
    for i, name in enumerate(files, 1):
        src = os.path.join(SRC, name)
        base = os.path.splitext(name)[0]
        thumb = os.path.join(OUT, 'thumb', base + '.webp')
        large = os.path.join(OUT, 'large', base + '.webp')
        with Image.open(src) as raw:
            when = photo_date(src, raw)
            w, h = raw.size
            if (raw.getexif() or {}).get(274) in (5, 6, 7, 8):   # rotated 90 degrees
                w, h = h, w
            if not (fresh(thumb, src) and fresh(large, src)):    # only convert new/changed photos
                im = to_srgb(ImageOps.exif_transpose(raw))       # right way up, right colors
                big = im.copy()
                big.thumbnail((LARGE_MAX, LARGE_MAX), Image.LANCZOS)
                save_webp(big, large, 80)
                small = im.copy()
                small.thumbnail((THUMB_H * 4, THUMB_H), Image.LANCZOS)
                save_webp(small, thumb, 72)
                made += 1
                print(f'  [{i}/{len(files)}] {name}', flush=True)
        items.append({
            't': 'assets/images/gallery-web/thumb/' + base + '.webp',
            'l': 'assets/images/gallery-web/large/' + base + '.webp',
            'w': w, 'h': h,
            'd': when.strftime('%Y-%m-%dT%H:%M:%S'),
        })
    items.sort(key=lambda x: x['d'], reverse=True)              # newest first
    with open(os.path.join(OUT, 'gallery-data.json'), 'w') as fh:
        json.dump({'count': len(items), 'built': datetime.now().isoformat(timespec='seconds'),
                   'photos': items}, fh, separators=(',', ':'))
    keep = {os.path.basename(x['t']) for x in items}
    stale = sorted(f for f in os.listdir(os.path.join(OUT, 'thumb')) if f.endswith('.webp') and f not in keep)
    if stale:                                     # photo removed from the gallery folder; files left behind
        print('Leftover web copies of removed photos (safe to move to trash):', stale)
    print(f'Done: {len(items)} photos ({made} new/updated).')


if __name__ == '__main__':
    sys.exit(main())
