import fs from "fs";

export function readLogs() {
  return JSON.parse(fs.readFileSync("./data/logs.json", "utf-8"));
}

export function writeLogs(data) {
  fs.writeFileSync("./data/logs.json", JSON.stringify(data, null, 2));
}

export function readDevices() {
  return JSON.parse(fs.readFileSync("./data/devices.json", "utf-8"));
}

export function writeDevices(data) {
  fs.writeFileSync("./data/devices.json", JSON.stringify(data, null, 2));
}
