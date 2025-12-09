// FINAL VERSION — AUTH SERVICE ABLY (PUSHER PROTOCOL MODE)
import Pusher from "pusher";
import { applyCors } from "../_cors.js";

export const config = { runtime: "nodejs" };

// IP yang diizinkan melakukan monitoring (hanya dashboard admin)
const ALLOW_IP = "182.168.0.235";
const ALLOW_MAC = "A4-BB-6D-BA-66-F4"; // contoh dari log kamu

// Setup Ably (REST Pusher Protocol)
const pusher = new Pusher({
    appId: process.env.ABLY_APP_ID, // ex: R2yUfw
    key: `${process.env.ABLY_APP_ID}.${process.env.ABLY_KEY_ID}`, // ex: R2yUfw.3C47dg
    secret: process.env.ABLY_KEY_SECRET, // ex: shDrY-...
    host: "rest-pusher.ably.io",
    port: 443,
    scheme: "https",
    useTLS: true,
});

export default async function handler(req, res) {
    applyCors(res);

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    const {
        socket_id,
        channel_name,
        user_id,
        username,
        name,
        ip,
        host,
        time,
    } = req.body;

    /* =======================================================
        🔐 1. SECURITY CHECK — FILTER IP
        HANYA IP tertentu yang boleh subscribe presence channel
    ======================================================== */

    if (ip !== ALLOW_IP && host !== ALLOW_MAC) {
        return res.status(403).json({
            error: "Access denied: Your device is not allowed to subscribe.",
        });
    }

    /* =======================================================
        2. Data presence user
    ======================================================== */
    const presenceData = {
        user_id,
        user_info: {
            username: username || name,
            name: name || username,
            ip: ip ?? "-",
            host: host ?? "-",
            time: time ?? new Date().toISOString(),
        },
    };

    /* =======================================================
        3. AUTHENTICATE ke Ably (Pusher Protocol)
    ======================================================== */
    try {
        const auth = pusher.authenticate(
            socket_id,
            channel_name,
            presenceData
        );

        return res.send(auth);
    } catch (err) {
        return res.status(500).json({
            error: "Auth failed",
            message: err.message,
        });
    }
}
