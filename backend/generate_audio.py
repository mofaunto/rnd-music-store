# backend/generate_audio.py
import os
import random
from music21 import stream, note, chord, tempo, instrument

OUTPUT_DIR = "static/audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Try multiple possible SF2 paths (Mac & Linux)
SF2_PATH = os.path.join(OUTPUT_DIR, "FluidR3_GM.sf2")

# def find_sf2():
#     for path in SF2_PATHS:
#         if os.path.exists(path):
#             return path
#     # If none found, download a known good one from a reliable mirror
#     print("No SoundFont found. Downloading from GitHub...")
#     import subprocess
#     url = "https://github.com/FluidSynth/fluid-soundfont/raw/master/FluidR3_GM.sf2"
#     dest = SF2_PATHS[-1]
#     subprocess.run(["curl", "-L", "-o", dest, url], check=True)
#     return dest

# SF2_PATH = find_sf2()
print(f"Using SoundFont: {SF2_PATH}")

def generate_midi_track(seed, filename):
    rng = random.Random(seed)
    s = stream.Stream()
    
    # Tempo
    bpm = rng.randint(80, 140)
    s.append(tempo.MetronomeMark(number=bpm))
    
    # Chords (Piano)
    progression = [
        ['C4', 'E4', 'G4'],
        ['F4', 'A4', 'C5'],
        ['G4', 'B4', 'D5'],
        ['C4', 'E4', 'G4']
    ]
    total_q = 0
    while total_q < 60:  # ~30 sec at 120 BPM
        for pitch_list in progression:
            c = chord.Chord(pitch_list)
            c.duration.quarterLength = rng.choice([2.0, 3.0, 4.0])
            s.append(c)
            total_q += c.duration.quarterLength
            if total_q >= 60:
                break
    
    # Melody (Piano)
    melody = stream.Part()
    melody.append(instrument.Piano())
    for _ in range(rng.randint(20, 30)):
        n = note.Note(rng.choice(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']))
        n.duration.quarterLength = rng.choice([0.5, 1.0, 2.0])
        melody.append(n)
    s.insert(0, melody)
    
    s.write('midi', fp=filename)

print("Generating 100 audio tracks...")
for i in range(100):
    midi_file = f"{OUTPUT_DIR}/track_{i}.mid"
    raw_file = f"{OUTPUT_DIR}/track_{i}.raw"
    mp3_file = f"{OUTPUT_DIR}/track_{i}.mp3"
    
    generate_midi_track(i, midi_file)
    
    # Convert MIDI → raw PCM → MP3
    cmd_fluidsynth = f"fluidsynth -ni -g 2.0 -T raw -F {raw_file} {SF2_PATH} {midi_file}"
    if os.system(cmd_fluidsynth) != 0:
        print(f"fluidsynth error on track {i}")
        continue
    
    cmd_lame = f"lame -r -s 44100 -b 64 {raw_file} {mp3_file}"
    os.system(cmd_lame)
    
    # Cleanup
    os.remove(midi_file)
    os.remove(raw_file)
    print(f"Generated track {i}/100")

print("Audio generation complete!")