from ultralytics import YOLO
import sys
import json
import warnings
import os

warnings.filterwarnings("ignore")

# Validate arguments
if len(sys.argv) < 2:
    print("[]")
    sys.exit(0)

image_path = sys.argv[1]

if not os.path.exists(image_path):
    print("[]")
    sys.exit(0)

# Absolute path to model for live server reliability
BASE_DIR = os.getcwd()
MODEL_PATH = os.path.join(BASE_DIR, "python", "yolov8m.pt")

try:
    model = YOLO(MODEL_PATH)
except Exception as e:
    print("[]")
    sys.exit(0)

try:
    results = model(image_path)

    names = results[0].names
    labels = []

    for box in results[0].boxes:
        cls = int(box.cls[0])
        labels.append(names.get(cls, ""))

    # Remove blanks and duplicates
    labels = list(set(filter(None, labels)))

    # Output valid JSON ONLY
    print(json.dumps(labels))

except Exception as e:
    print("[]")
    sys.exit(0)
