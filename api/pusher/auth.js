import Pusher from "pusher";

export const config = {
    runtime: "nodejs",
};

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { socket_id, channel_name, user_id, username } = req.body;

    if (!user_id || !username) {
        return res.status(400).json({ error: "Missing user data" });
    }

    const presenceData = {
        user_id,
        user_info: { username },
    };

    const auth = pusher.authenticate(socket_id, channel_name, presenceData);

    res.send(auth);
}
