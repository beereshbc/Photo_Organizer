import { spawn } from "child_process";
import path from "path";

export const getAutoTags = (localImagePath) => {
  return new Promise((resolve) => {
    const pyPath = path.join(process.cwd(), "python", "yolo_detector.py");

    // Force Linux-compatible Python execution (Render)
    const py = spawn("python3", [pyPath, localImagePath], {
      env: process.env,
    });

    let output = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.error("YOLO ERROR:", data.toString());
    });

    py.on("error", (err) => {
      console.error("PYTHON SPAWN FAILED:", err.message);
      resolve([]);
    });

    py.on("close", () => {
      try {
        const clean = output
          .split("\n")
          .find((line) => line.trim().startsWith("[")); // Only JSON

        const tags = clean ? JSON.parse(clean) : [];
        resolve(tags);
      } catch (err) {
        console.error("YOLO PARSE ERROR:", err.message);
        resolve([]);
      }
    });
  });
};
