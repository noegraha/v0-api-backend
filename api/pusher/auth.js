// api/pusher/auth.js
import Pusher from "pusher";
import { applyCors } from "../_cors.js"; // sesuaikan path kalau beda

export const config = { runtime: "nodejs" };

const pusher = new Pusher({
    appId: process.env.ABLY_APP_ID,
    key: `${process.env.ABLY_APP_ID}.${process.env.ABLY_KEY_ID}`,
    secret: process.env.ABLY_KEY_SECRET,
    host: "rest-pusher.ably.io",
    port: 443,
    scheme: "https",
    useTLS: true,
});

const safe = (v, def = "-") =>
    v === undefined || v === null || v === "" ? def : v;

export default async function handler(req, res) {
    applyCors(res);

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    try {
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

        if (!socket_id || !channel_name || !user_id) {
            return res.status(400).json({ error: "Invalid auth request" });
        }

        const presenceData = {
            user_id,
            user_info: {
                username: safe(username),
                name: safe(name, username),
                ip: safe(ip),
                host: safe(host),
                role: safe(role).toUpperCase(),
                time: time ?? new Date().toISOString(),
            },
        };

        const auth = pusher.authenticate(socket_id, channel_name, presenceData);
        console.log("✅ AUTH OK:", {
            ch: channel_name,
            user_id,
            role: presenceData.user_info.role,
            ip: presenceData.user_info.ip,
        });

        return res.send(auth);
    } catch (err) {
        console.error("❌ AUTH ERROR:", err);
        return res.status(500).json({ error: "Auth failed" });
    }
}
