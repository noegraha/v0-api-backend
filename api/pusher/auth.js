// AUTH presence-all + SUBSCRIBE for SMG only
import Pusher from "pusher";
import { applyCors } from "../_cors.js";

export const config = { runtime: "nodejs" };

const ALLOW_IP = "182.168.0.235";
const ALLOW_ROLES = ["SMG"];

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

    const { socket_id, channel_name, user_id, username, name, ip, host, role, time } = req.body;

    // 🔵 Semua user boleh masuk presence-online agar dashboard bisa lihat mereka
    const presenceData = {
        user_id,
        user_info: {
            username,
            name,
            ip,
            host,
            role,
            time: time ?? new Date().toISOString(),
        },
    };

    // 🔴 FILTER SUBSCRIBE khusus role SMG
    const isDashboardSMG = (role === "SMG" && ip === ALLOW_IP);

    // Jika bukan SMG, dan channel ini adalah CHANNEL DASHBOARD
    if (channel_name === "presence-online" && !isDashboardSMG) {
        // Jangan izinkan subscribe
        // tapi user tetap boleh authenticate (agar counted sebagai online)
        return res.status(403).json({ error: "Only SMG can subscribe to dashboard" });
    }

    // 🔵 Authenticate normal
    try {
        const auth = pusher.authenticate(
            socket_id,
            channel_name,
            presenceData
        );
        return res.send(auth);
    } catch (err) {
        return res.status(500).json({ error: "Auth failed" });
    }
}
