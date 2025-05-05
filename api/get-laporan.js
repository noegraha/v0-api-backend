// File: /api/get-laporan.js

import mysql from "mysql2/promise";

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  let connection;

  try {
    // Connect to the database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 15000,
    });

    // Fetch data
    const [rows] = await connection.execute(
      "SELECT * FROM laporan_kanker ORDER BY tanggal DESC"
    );

    // Return the results
    res.status(200).json(rows);
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
      details: error.code,
    });
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
}
