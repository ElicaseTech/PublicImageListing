import json
from pathlib import Path

# Images目录
IMAGE_DIR = Path("Images")

# 输出文件
OUTPUT_FILE = Path("images.json")

# 扫描所有 webp
files = sorted([
    file.name
    for file in IMAGE_DIR.iterdir()
    if file.is_file() and file.suffix.lower() == ".webp"
])

# 写入 json
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(files, f, ensure_ascii=False, indent=2)

print(f"Generated {OUTPUT_FILE} ({len(files)} images)")