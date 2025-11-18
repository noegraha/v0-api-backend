// File: /api/random-quote.js

export const runtime = "nodejs";

export default async function handler(req, res) {
    // Tambah CORS headers (samakan dengan get-laporan)
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    // Handle preflight
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    // Hanya izinkan GET
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        // Panggil API quotes eksternal
        const apiRes = await fetch(
            "https://quotes.liupurnomo.com/api/quotes/random"
        );

        if (!apiRes.ok) {
            throw new Error("Failed to fetch from quotes API");
        }

        const data = await apiRes.json();

        // Langsung teruskan response-nya
        return res.status(200).json(data);
    } catch (error) {
        console.error("Gagal ambil quote:", error);
        return res.status(500).json({
            status: "ERROR",
            message: "Gagal ambil quote dari server proxy",
            error: error.message,
        });
    }
}
