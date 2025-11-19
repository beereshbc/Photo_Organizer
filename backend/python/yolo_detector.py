from ultralytics import YOLO
import sys
import json

model = YOLO("yolov8n.pt")   # auto-download first time

image_path = sys.argv[1]

results = model(image_path)

names = results[0].names
labels = []

for box in results[0].boxes:
    cls = int(box.cls[0])
    labels.append(names[cls])

# remove duplicates
labels = list(set(labels))

print(json.dumps(labels))
