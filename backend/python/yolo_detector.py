from ultralytics import YOLO
import sys
import json
import warnings
import os

warnings.filterwarnings("ignore")

image_path = sys.argv[1]

if not os.path.exists(image_path):
    print("[]")
    exit()

# Load YOLOv8 model
model = YOLO("yolov8m.pt")

# Run inference
results = model(image_path)

names = results[0].names
labels = []

for box in results[0].boxes:
    cls = int(box.cls[0])
    labels.append(names[cls])

# Remove duplicates
labels = list(set(labels))

# Print ONLY valid JSON
print(json.dumps(labels))
