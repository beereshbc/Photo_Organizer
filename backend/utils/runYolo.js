import { spawn } from "child_process";
import path from "path";

export const getAutoTags = (localImagePath) => {
  return new Promise((resolve) => {
    const pyPath = path.join(process.cwd(), "python", "yolo_detector.py");

    const py = spawn("python", [pyPath, localImagePath]);

    let output = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.error("YOLO ERROR:", data.toString());
    });

    py.on("close", () => {
      try {
        // Extract ONLY the JSON line (starts with '[')
        const clean = output
          .split("\n")
          .find((line) => line.trim().startsWith("["));

        const tags = clean ? JSON.parse(clean) : [];
        resolve(tags);
      } catch (err) {
        console.log("YOLO PARSE ERROR:", err);
        resolve([]);
      }
    });
  });
};
