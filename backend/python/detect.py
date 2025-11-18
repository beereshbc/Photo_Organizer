from ultralytics import YOLO
import sys
import json

# Get image path
image_path = sys.argv[1]

# Load YOLO model
model = YOLO("yolov8s.pt")

# Run detection
results = model(image_path)

objects = []

for r in results:
    for box in r.boxes:
        cls = int(box.cls[0])          # class ID
        name = model.names[cls]        # class name (person, car etc.)
        objects.append(name)

# Remove duplicates
objects = list(set(objects))

# Return clean comma separated list
# Example: "person,car,dog"
print(",".join(objects))
