import { Router } from "express";

const router = Router();

export const detectionRouter = router.post("/detection", (req, res) => {
  res.json({ message: "Detection route" });
});
