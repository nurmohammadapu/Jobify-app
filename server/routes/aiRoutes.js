import express from "express";
import aiController from "../controllers/aiController.js"; 

const router = express.Router();

router.post("/generate-text", aiController.generateText);

export default router;
