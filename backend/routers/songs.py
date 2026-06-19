from fastapi import APIRouter, Query
from fastapi.responses import FileResponse
import math
import random
import os
from utils.locale import load_locales
from utils.image_gen import generate_cover_image, COVER_CACHE_DIR

router = APIRouter()
LOCALES = load_locales()

@router.get("/api/songs")
async def get_songs(
    lang: str = Query("en-US", description="Language/Region code"),
    seed: int = Query(12345, description="64-bit seed value"),
    page: int = Query(1, description="Page number for pagination"),
    likes: float = Query(0.0, description="Average likes per song")
):
    locale_data = LOCALES.get(lang, LOCALES.get("en-US", {}))
    final_seed = seed ^ (page * 0x9e3779b97f4a7c15)
    rng = random.Random(final_seed)
    
    songs = []
    for i in range(10):
        if rng.random() < 0.5:
            artist = f"{rng.choice(locale_data['first_names'])} {rng.choice(locale_data['last_names'])}"
        else:
            artist = f"{rng.choice(locale_data['band_prefixes'])} {rng.choice(locale_data['band_suffixes'])}"
        
        title = f"{rng.choice(locale_data['album_adjectives'])} {rng.choice(locale_data['album_nouns'])}"
        
        if rng.random() < 0.3:
            album = "Single"
        else:
            album = f"{rng.choice(locale_data['album_adjectives'])} {rng.choice(locale_data['album_nouns'])}"
        
        genre = rng.choice(locale_data['genres'])

        if likes == 0.0:
            like_count = 0
        elif likes >= 10.0:
            like_count = 10
        else:
            floor_likes = math.floor(likes)
            remainder = likes - floor_likes
            like_count = floor_likes + (1 if rng.random() < remainder else 0)
        
        songs.append({
            "index": (page - 1) * 10 + (i + 1),
            "title": title,
            "artist": artist,
            "album": album,
            "genre": genre,
            "likes": like_count
        })

    return {"page": page, "songs": songs}


@router.get("/api/details/{song_id}")
async def get_song_details(
    song_id: int,
    lang: str = Query("en-US", description="Language/Region code"),
    seed: int = Query(12345, description="64-bit seed value"),
    page: int = Query(1, description="Page number")
):
    locale_data = LOCALES.get(lang, LOCALES.get("en-US", {}))
    final_seed = seed ^ (page * 0x9e3779b97f4a7c15) ^ (song_id * 0x9e3779b97f4a7c15)
    rng = random.Random(final_seed)
    
    reviewer = f"{rng.choice(locale_data['first_names'])} {rng.choice(locale_data['last_names'])}"
    review_phrases = [
        "Absolutely breathtaking track, a true masterpiece!",
        "Love the vibe, but the mixing could be better.",
        "This one's going straight to my playlist.",
        "Incredible melody, I can't stop listening.",
        "Not quite my style, but well produced.",
        "The chorus is a bit repetitive, but it's catchy!"
    ]
    review = f"\"{rng.choice(review_phrases)}\" — {reviewer}"
    
    lyrics = [
        f"Under the {rng.choice(locale_data['album_nouns']).lower()} we stand",
        f"Our {rng.choice(locale_data['album_adjectives']).lower()} dreams fill the land",
        f"Just like a {rng.choice(locale_data['genres']).lower()} refrain"
    ]
    
    return {
        "song_id": song_id,
        "review": review,
        "lyrics": lyrics
    }


@router.get("/api/cover/{song_id}")
async def get_cover(
    song_id: int,
    title: str = Query(..., description="Song Title from frontend"),
    artist: str = Query(..., description="Artist Name from frontend"),
    lang: str = Query("en-US", description="Language/Region code"),
    seed: int = Query(12345, description="64-bit seed value"),
    page: int = Query(1, description="Page number")
):
    final_seed = seed ^ (page * 0x9e3779b97f4a7c15) ^ (song_id * 0x9e3779b97f4a7c15)
    rng = random.Random(final_seed)
    
    file_path = os.path.join(COVER_CACHE_DIR, f"{final_seed}_{lang}.png")
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="image/png")

    generate_cover_image(file_path, title, artist, rng)
    
    return FileResponse(file_path, media_type="image/png")