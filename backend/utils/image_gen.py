from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import random
import os

COVER_CACHE_DIR = "./cache/covers"
os.makedirs(COVER_CACHE_DIR, exist_ok=True)
BACKGROUND_DIR = "./static/backgrounds"

if not os.path.exists(BACKGROUND_DIR):
    os.makedirs(BACKGROUND_DIR, exist_ok=True)
    
ALL_BG_FILES = [f for f in os.listdir(BACKGROUND_DIR) if f.endswith(('.jpg', '.jpeg', '.png'))]

def generate_cover_image(filename: str, title: str, artist: str, rng: random.Random):
    width, height = 400, 400

    if ALL_BG_FILES:
        bg_name = rng.choice(ALL_BG_FILES)
        bg_path = os.path.join(BACKGROUND_DIR, bg_name)
        try:
            img = Image.open(bg_path).convert('RGB')
        except:
            img = Image.new('RGB', (width, height), (rng.randint(0,255), rng.randint(0,255), rng.randint(0,255)))
    else:
        img = Image.new('RGB', (width, height), (rng.randint(0,255), rng.randint(0,255), rng.randint(0,255)))

    if rng.random() > 0.5:
        zoom_scale = rng.uniform(1.1, 1.3)
        w, h = img.size
        crop_w, crop_h = int(w / zoom_scale), int(h / zoom_scale)
        left = rng.randint(0, w - crop_w)
        top = rng.randint(0, h - crop_h)
        img = img.crop((left, top, left + crop_w, top + crop_h))
    img = img.resize((width, height), Image.Resampling.LANCZOS)

    if rng.random() > 0.6:
        tint_color = (rng.randint(0, 255), rng.randint(0, 255), rng.randint(0, 255))
        tint_overlay = Image.new('RGB', (width, height), tint_color)
        alpha = rng.uniform(0.05, 0.25)
        img = Image.blend(img, tint_overlay, alpha)

    if rng.random() > 0.7:
        img = img.convert('L').convert('RGB')

    if rng.random() > 0.8:
        blur_radius = rng.uniform(1.0, 4.0)
        img = img.filter(ImageFilter.GaussianBlur(radius=blur_radius))

    draw = ImageDraw.Draw(img)

    if rng.random() > 0.6:
        overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        
        shape_color = (rng.randint(0, 255), rng.randint(0, 255), rng.randint(0, 255), 60)
        shape_type = rng.choice(['ellipse', 'rectangle'])
        
        cx, cy = rng.randint(50, 350), rng.randint(50, 350)
        rx, ry = rng.randint(50, 200), rng.randint(50, 200)
        if shape_type == 'ellipse':
            overlay_draw.ellipse([cx-rx, cy-ry, cx+rx, cy+ry], fill=shape_color)
        else:
            overlay_draw.rectangle([cx-rx, cy-ry, cx+rx, cy+ry], fill=shape_color)
            
        img.paste(overlay, (0, 0), overlay)

    try:
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        font_title = ImageFont.truetype(font_path, 38)
        font_artist = ImageFont.truetype(font_path, 20)
    except:
        font_title = ImageFont.load_default()
        font_artist = ImageFont.load_default()

    corner_pixel = img.getpixel((10, 10))
    avg_brightness = sum(corner_pixel) / 3
    text_is_dark = avg_brightness > 140
    
    text_color = (0, 0, 0) if text_is_dark else (255, 255, 255)
    shadow_color = (255, 255, 255) if text_is_dark else (0, 0, 0)
    
    if rng.random() > 0.8:
        text_color, shadow_color = shadow_color, text_color

    placement = rng.choice(['top', 'center', 'bottom'])
    if placement == 'top':
        tx, ty = width//2, 60
        ax, ay = width//2, 110
    elif placement == 'center':
        tx, ty = width//2, height//2 - 30
        ax, ay = width//2, height//2 + 40
    else:
        tx, ty = width//2, height - 90
        ax, ay = width//2, height - 50

    shadow_offset = rng.choice([0, 2, 4])
    if shadow_offset > 0:
        draw.text((tx + shadow_offset, ty + shadow_offset), title, font=font_title, fill=shadow_color, anchor="mm")
    
    draw.text((tx, ty), title, font=font_title, fill=text_color, anchor="mm")
    draw.text((ax, ay), artist, font=font_artist, fill=text_color, anchor="mm")

    img.save(filename, "PNG")