import express from "express";
import cors from "cors";
import { detectionRouter } from "./routes/detection.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/detection", detectionRouter);

export default app;
