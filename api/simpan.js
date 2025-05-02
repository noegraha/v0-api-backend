// api/simpan.js
import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { data, hasil, tanggal } = req.body;

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  try {
    const [rows] = await connection.execute(
      "INSERT INTO laporan_kanker (data_form, hasil, tanggal) VALUES (?, ?, ?)",
      [JSON.stringify(data), hasil, tanggal]
    );
    res.status(200).json({ success: true, id: rows.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await connection.end();
  }
}
