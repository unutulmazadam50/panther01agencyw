from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(r"C:\Users\beko\Desktop\panther01agency")
SOURCE_DIR = ROOT / "output" / "panther01agency-meta-posters"
DESTINATION_DIR = SOURCE_DIR / "final-with-official-logo"
LOGO_PATH = Path(r"C:\Users\beko\Desktop\MY JOB\logo\2.png")
POSTER_COVER_RIGHT = {
    "01-otomasyon-akis.png": 800,
    "02-website-ilk-izlenim.png": 575,
    "03-otomasyon-mesajlar.png": 620,
    "04-website-yonlendiren.png": 600,
    "05-otomasyon-kontrol.png": 620,
    "06-website-cihazlar.png": 630,
    "07-karma-hizmet.png": 650,
}


def official_logo() -> Image.Image:
    logo = Image.open(LOGO_PATH).convert("RGBA")
    bbox = logo.getchannel("A").getbbox()
    if bbox is None:
        raise RuntimeError("Logo has no visible pixels.")
    # Remove only transparent canvas; the visible logo artwork remains unmodified.
    logo = logo.crop(bbox)
    return logo.resize((280, 113), Image.Resampling.LANCZOS)


def replace_footer_lockup(source: Path, destination: Path, logo: Image.Image, cover_right: int) -> None:
    poster = Image.open(source).convert("RGBA")
    width, height = poster.size

    # The generated lockups are all in the left side of the footer. Rebuild only
    # that area with a softly sampled continuation of its own dark footer surface.
    left, top, right, bottom = 42, int(height * 0.907), cover_right, height - 18
    # Cover only the generated brand lockup. The CTA area remains untouched.
    # A short fade on the right prevents a visible hard edge against the footer.
    sampled_color = poster.getpixel((18, top + 18))
    clean_footer = Image.new("RGBA", (right - left, bottom - top), sampled_color)
    alpha = Image.new("L", clean_footer.size, 255)
    fade = 24
    for x in range(clean_footer.width - fade, clean_footer.width):
        alpha_value = int(255 * (clean_footer.width - x - 1) / fade)
        for y in range(clean_footer.height):
            alpha.putpixel((x, y), alpha_value)
    clean_footer.putalpha(alpha)
    poster.alpha_composite(clean_footer, (left, top))

    logo_x = 72
    logo_y = top + (bottom - top - logo.height) // 2
    poster.alpha_composite(logo, (logo_x, logo_y))
    poster.convert("RGB").save(destination, quality=95)


def main() -> None:
    DESTINATION_DIR.mkdir(parents=True, exist_ok=True)
    logo = official_logo()
    for name, cover_right in POSTER_COVER_RIGHT.items():
        replace_footer_lockup(SOURCE_DIR / name, DESTINATION_DIR / name, logo, cover_right)


if __name__ == "__main__":
    main()
