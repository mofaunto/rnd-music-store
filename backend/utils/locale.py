import json
from pathlib import Path

def load_locales():
    LOCALES = {}
    LOCALES_DIR = Path("locales")
    if LOCALES_DIR.exists():
        for file_path in LOCALES_DIR.glob("*.json"):
            with open(file_path, "r", encoding="utf-8") as f:
                LOCALES[file_path.stem] = json.load(f)
    return LOCALES