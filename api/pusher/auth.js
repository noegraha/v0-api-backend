// AUTH.PRESENCE → semua user boleh masuk presence
// AUTH.SUBSCRIBE → hanya SMG yang boleh subscribe
import Pusher from "pusher";
import { applyCors } from "../_cors.js";

export const config = { runtime: "nodejs" };

// const ALLOW_DASHBOARD_IP = "182.168.0.235";
const ALLOW_DASHBOARD_ROLES = ["SMG"];

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

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    const { socket_id, channel_name, user_id, name, username, ip, host, role, time } = req.body;

    // semua user tetap diizinkan masuk presence → supaya terdeteksi online/offline
    const presenceData = {
        user_id,
        user_info: {
            username,
            name: name || username, // fallback
            ip,
            host,
            role,
            time: time ?? new Date().toISOString(),
        },
    };

    // 🔥 Filtering khusus SUBSCRIPTION untuk dashboard
    const isDashboard =
        ALLOW_DASHBOARD_ROLES.includes(role);

    if (!isDashboard && channel_name === "presence-dashboard") {
        // Channel dashboard khusus admin SMG
        return res.status(403).json({ error: "Access denied: not SMG dashboard user" });
    }

    // Untuk presence-online → SELALU berhasil (agar semua user tercatat)
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
