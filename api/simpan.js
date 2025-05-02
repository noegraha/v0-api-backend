import mysql from "mysql2/promise";

export default async function handler(req, res) {
  // Tambahkan header CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { data, hasil, tanggal } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await connection.execute(
      "INSERT INTO laporan_kanker (data_form, hasil, tanggal) VALUES (?, ?, ?)",
      [JSON.stringify(data), hasil, tanggal]
    );

    await connection.end();
    res.status(200).json({ message: "Data berhasil disimpan ke database" });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ message: "Gagal menyimpan data", error });
  }
}
