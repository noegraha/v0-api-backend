import Pusher from "pusher";
import { applyCors } from "../_cors.js";

export const config = { runtime: "nodejs" };

// Dashboard SMG hanya boleh mengakses dari IP ini
const ALLOW_IP = "182.168.0.235";
const ALLOW_ROLE = "SMG";

const pusher = new Pusher({
    appId: process.env.ABLY_APP_ID,
    key: `${process.env.ABLY_APP_ID}.${process.env.ABLY_KEY_ID}`,
    secret: process.env.ABLY_KEY_SECRET,
    host: "rest-pusher.ably.io",
    port: 443,
    scheme: "https",
    useTLS: true,
});

export default async function handler(req, res) {
    applyCors(res);
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
        role,
        time,
    } = req.body;

    const safeRole = (role || "").toUpperCase();
    const safeIP = ip || "";

    // =========================================================
    // 1️⃣ Semua user boleh AUTH untuk presence-online
    //    karena dashboard butuh tau siapa online/offline
    // =========================================================
    const presenceData = {
        user_id,
        user_info: {
            username,
            name,
            ip,
            host,
            role: safeRole,
            time: time ?? new Date().toISOString(),
        },
    };

    // =========================================================
    // 2️⃣ Filtering SUBSCRIBE (bukan membership)
    //    Hanya role SMG dan IP dashboard boleh subscribe
    // =========================================================
    const isSMGDashboard = role === "SMG" && ip === ALLOW_IP;

    // Semua user boleh authenticate presence-online
    if (channel_name === "presence-online") {
        // Jika user bukan SMG dashboard → jangan izinkan subscribe
        if (!isSMGDashboard) {
            console.log("⛔ Non SMG blocked from SUBSCRIBING, but membership allowed.");
            // penting: authenticate tetap dikirim kan, agar mereka masuk membership
            return res.send(pusher.authenticate(socket_id, channel_name, presenceData));
        }
    }

    // SMG dashboard: boleh subscribe
    return res.send(pusher.authenticate(socket_id, channel_name, presenceData));

}
