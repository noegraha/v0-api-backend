// File: /api/random-quote-id.js
export const runtime = "nodejs";

export default async function handler(req, res) {
    // CORS (samakan dengan get-laporan.js)
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    // Preflight
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    // Izinkan hanya GET
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        // 🔥 Generate random ID 1–960
        const randomId = Math.floor(Math.random() * 960) + 1;
        console.log("Random ID:", randomId);

        // Ambil quote by ID
        const apiRes = await fetch(
            `https://quotes.liupurnomo.com/api/quotes/${randomId}`
        );

        const json = await apiRes.json();

        return res.status(200).json(json);
    } catch (error) {
        console.error("Gagal mengambil quote:", error);

        return res.status(500).json({
            status: "ERROR",
            message: "Gagal mengambil quote dari server",
            error: error.message,
        });
    }
}
