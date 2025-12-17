import { Readable } from "stream";
import { detectFace } from "./azureFace.service.js";

export const detectFaceController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Buffer → ReadableStream
        const stream = () => Readable.from(req.file.buffer);

        const result = await detectFace(stream);

        return res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("AZURE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
