// auth.js — versi Ably Pusher-Compatible
import Pusher from "pusher";
import { applyCors } from '../_cors.js';

export const config = { runtime: "nodejs" };

// Gunakan REST endpoint Ably dengan Pusher Protocol
const pusher = new Pusher({
    appId: process.env.ABLY_APP_ID,
    key: process.env.ABLY_KEY_ID,
    secret: process.env.ABLY_KEY_SECRET,
    host: "rest-pusher.ably.io",
    port: 443,
    scheme: "https",
    useTLS: true,
});

export default async function handler(req, res) {
    applyCors(res);

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { socket_id, channel_name, user_id, username, name, ip, host, time } = req.body;

    const presenceData = {
        user_id,
        user_info: {
            username: username || name,
            name: name || username,
            ip: ip ?? "-",
            host: host ?? "-",
            time: time ?? new Date().toISOString()
        }
    };

    try {
        const auth = pusher.authenticate(socket_id, channel_name, presenceData);
        return res.send(auth);
    } catch (err) {
        console.error("ABLY AUTH ERROR:", err);
        return res.status(500).json({ error: "Auth failed" });
    }
}
