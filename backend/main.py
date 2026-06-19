from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.songs import router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://rnd-music-store.vercel.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend connected successfully!"}

app.include_router(router)