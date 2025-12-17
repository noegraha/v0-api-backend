import express from "express";
import multer from "multer";
import { detectFaceController } from "./face.controller.js";

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.post(
    "/detect",
    upload.single("image"),
    detectFaceController
);

export default router;
