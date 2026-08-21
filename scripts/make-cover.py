"""Convert a source cover image into an optimised web JPEG for an article.

    python scripts/make-cover.py <source-image> <article-slug>

Writes public/articles/<slug>/cover.jpg at TARGET_W wide.

Source art is typically ~2MB PNG straight out of the generator; the site sets
`images: { unoptimized: true }`, so covers must be pre-sized here rather than
relying on Next to do it. Aspect ratio is always preserved: cover art carries
baked-in typography and must never be cropped or squashed.

Requires Pillow (already present in the system Python).
"""
import os
import sys

from PIL import Image

TARGET_W = 1600
QUALITY = 82


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        return 1

    src, slug = sys.argv[1], sys.argv[2].strip("/")
    if not os.path.isfile(src):
        print(f"error: no such file: {src}")
        return 1

    dest_dir = os.path.join("public", "articles", slug)
    os.makedirs(dest_dir, exist_ok=True)
    dest = os.path.join(dest_dir, "cover.jpg")

    im = Image.open(src).convert("RGB")
    src_w, src_h = im.size
    if src_w > TARGET_W:
        im = im.resize((TARGET_W, round(src_h * TARGET_W / src_w)), Image.LANCZOS)

    im.save(dest, "JPEG", quality=QUALITY, optimize=True, progressive=True)

    print(f"{dest}")
    print(f"  {src_w}x{src_h} ({os.path.getsize(src)/1024:.0f} KB) "
          f"-> {im.size[0]}x{im.size[1]} ({os.path.getsize(dest)/1024:.0f} KB)")
    print(f"  frontmatter: cover: \"/articles/{slug}/cover.jpg\"")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
