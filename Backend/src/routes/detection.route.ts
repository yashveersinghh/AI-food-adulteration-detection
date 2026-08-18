import { Router } from "express";
import { upload } from "../services/upload.service.js";
import { detectFood } from "../controllers/detection.controller.js";

const router = Router();

export const detectionRouter = router.post("/", upload.single("image"), detectFood);
