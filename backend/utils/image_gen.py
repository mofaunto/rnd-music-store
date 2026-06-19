from PIL import Image, ImageDraw, ImageFont
import random
import os

COVER_CACHE_DIR = "./cache/covers"
os.makedirs(COVER_CACHE_DIR, exist_ok=True)

def generate_cover_image(filename: str, title: str, artist: str, rng: random.Random):
    width, height = 400, 400
    img = Image.new('RGB', (width, height), (240, 240, 240))
    draw = ImageDraw.Draw(img)

    # gradient background
    c1 = (rng.randint(0,255), rng.randint(0,255), rng.randint(0,255))
    c2 = (rng.randint(0,255), rng.randint(0,255), rng.randint(0,255))
    for i in range(height):
        ratio = i / height
        r = int(c1[0] * (1 - ratio) + c2[0] * ratio)
        g = int(c1[1] * (1 - ratio) + c2[1] * ratio)
        b = int(c1[2] * (1 - ratio) + c2[2] * ratio)
        draw.line([(0, i), (width, i)], fill=(r, g, b))

    # random shapes
    for _ in range(rng.randint(8, 20)):
        shape_type = rng.choice(['ellipse', 'rectangle', 'line'])
        x1 = rng.randint(0, width)
        y1 = rng.randint(0, height)
        x2 = rng.randint(0, width)
        y2 = rng.randint(0, height)
        color = (rng.randint(0,255), rng.randint(0,255), rng.randint(0,255), rng.randint(40, 140))
        if shape_type == 'ellipse':
            draw.ellipse([min(x1,x2), min(y1,y2), max(x1,x2), max(y1,y2)], fill=color, outline=None)
        elif shape_type == 'rectangle':
            draw.rectangle([min(x1,x2), min(y1,y2), max(x1,x2), max(y1,y2)], fill=color, outline=None)
        else:
            draw.line([x1, y1, x2, y2], fill=color, width=rng.randint(2, 10))

    # text, artist, song
    try:
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        font_title = ImageFont.truetype(font_path, 34)
        font_artist = ImageFont.truetype(font_path, 20)
    except:
        font_title = ImageFont.load_default()
        font_artist = ImageFont.load_default()

    shadow_color = (0, 0, 0, 120)
    draw.text((width//2+2, height//2-40+2), title, font=font_title, fill=shadow_color, anchor="mm")
    draw.text((width//2-2, height//2-40-2), title, font=font_title, fill=shadow_color, anchor="mm")
    draw.text((width//2, height//2-40), title, font=font_title, fill=(255,255,255), anchor="mm")

    draw.text((width//2+2, height//2+40+2), artist, font=font_artist, fill=shadow_color, anchor="mm")
    draw.text((width//2-2, height//2+40-2), artist, font=font_artist, fill=shadow_color, anchor="mm")
    draw.text((width//2, height//2+40), artist, font=font_artist, fill=(255,255,255), anchor="mm")

    img.save(filename, "PNG")