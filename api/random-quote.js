// api/random-quote.js
export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const apiRes = await fetch(
            "https://quotes.liupurnomo.com/api/quotes/random"
        );

        if (!apiRes.ok) {
            throw new Error("Failed to fetch from quotes API");
        }

        const data = await apiRes.json();

        // Optional: kalau nanti mau diakses dari domain lain juga
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");

        return res.status(200).json(data);
    } catch (err) {
        console.error("Error fetch quote:", err.message);
        return res.status(500).json({
            status: "ERROR",
            message: "Gagal ambil quote dari server proxy",
        });
    }
}
