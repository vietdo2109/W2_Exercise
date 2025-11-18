import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import {
  readLogs,
  writeLogs,
  readDevices,
  writeDevices,
} from "../backend/database.js";
const app = express();

// setup dirname boilerplate
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve the whole /frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/api/logs", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  const start = (page - 1) * limit;
  const end = start + limit;

  const logs = readLogs();
  const paginated = logs.slice(start, end);
  console.log({
    logs: paginated,
    currentPage: page,
    totalpage: Math.ceil(logs.length / 10),
  });
  res.json({
    logs: paginated,
    currentPage: page,
    totalPage: Math.ceil(logs.length / 10),
  });
});

app.post("/api/logs", (req, res) => {
  const logs = readLogs();
  logs.push(req.body);
  writeLogs(logs);
  res.json({ success: true });
});

app.get("/api/devices", (req, res) => {
  const devices = readDevices();
  res.json(devices);
});

app.post("/api/devices", (req, res) => {
  const devices = writeDevices();
  devices.push(req.body);
  writeLogs(devices);
  res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on port 3000"));
