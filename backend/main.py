import json
import random
from pathlib import Path
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://rnd-music-store.vercel.app", "http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# load locals at startup
LOCALES = {}
LOCALES_DIR = Path("locales")
if LOCALES_DIR.exists():
    for file_path in LOCALES_DIR.glob("*.json"):
        with open(file_path, "r", encoding="utf-8") as f:
            LOCALES[file_path.stem] = json.load(f)
else:
    LOCALES = {}

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend connected successfully!"}


# generate songs
@app.get("/api/songs")
async def get_songs(
    lang: str = Query("en-US", description="Language/Region code"),
    seed: int = Query(12345, description="64-bit seed value"),
    page: int = Query(1, description="Page number for pagination")
):
    locale_data = LOCALES.get(lang, LOCALES.get("en-US", {}))

    final_seed = seed ^ (page * 0x9e3779b97f4a7c15)
    rng = random.Random(final_seed)
    
    songs = []
    
    for i in range(10):
        
        # 50% chance artist is a person, the other is a band
        if rng.random() < 0.5:
            artist = f"{rng.choice(locale_data['first_names'])} {rng.choice(locale_data['last_names'])}"
        else:
            artist = f"{rng.choice(locale_data['band_prefixes'])} {rng.choice(locale_data['band_suffixes'])}"
        
        # adjective + noun for song title
        title = f"{rng.choice(locale_data['album_adjectives'])} {rng.choice(locale_data['album_nouns'])}"
        
        # album Title: 30% chance it's a "Single", 70% adjective + noun album name
        if rng.random() < 0.3:
            album = "Single"
        else:
            album = f"{rng.choice(locale_data['album_adjectives'])} {rng.choice(locale_data['album_nouns'])}"
        
        genre = rng.choice(locale_data['genres'])
        
        songs.append({
            "index": (page - 1) * 10 + (i + 1), # global sequence number
            "title": title,
            "artist": artist,
            "album": album,
            "genre": genre
        })

    return {"page": page, "songs": songs}