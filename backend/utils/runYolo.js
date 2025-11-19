import { spawn } from "child_process";
import path from "path";

export const getAutoTags = (localImagePath) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(process.cwd(), "python", "yolo_detector.py");

    const py = spawn("python", [pythonScript, localImagePath]);

    let output = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.error("YOLO ERROR:", data.toString());
    });

    py.on("close", () => {
      try {
        const labels = JSON.parse(output);
        resolve(labels);
      } catch (err) {
        resolve([]); // if YOLO fails — return empty tags
      }
    });
  });
};
