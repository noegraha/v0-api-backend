// api/simpan.js

import mysql from "mysql2/promise"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  try {
    const { data, hasil, tanggal } = req.body

    // Log the request for debugging
    console.log("Request received:", {
      method: req.method,
      body: req.body,
      headers: req.headers,
    })

    if (!data || !hasil || !tanggal) {
      return res.status(400).json({
        message: "Data tidak lengkap",
        received: {
          data: !!data,
          hasil: !!hasil,
          tanggal: !!tanggal,
        },
      })
    }

    // Log database connection attempt
    console.log("Attempting database connection with:", {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      // Don't log the actual password
      password: process.env.DB_PASSWORD ? "provided" : "missing",
    })

    // Koneksi ke database MySQL (ganti sesuai kredensial hosting kamu)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST, // contoh: 'localhost' atau 'sqlxxx.hostinger.com'
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    console.log("Database connection successful")

    // Buat tabel jika belum ada
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS laporan_kanker (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100),
        umur INT,
        jenis_kelamin VARCHAR(20),
        gejala TEXT,
        hasil VARCHAR(50),
        tanggal DATE
      )
    `)

    // Masukkan data
    await connection.execute(
      `INSERT INTO laporan_kanker (nama, umur, jenis_kelamin, gejala, hasil, tanggal)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.nama,
        data.umur,
        data.jenis_kelamin,
        JSON.stringify(data.gejala), // disimpan sebagai string JSON
        hasil,
        tanggal,
      ],
    )

    res.status(200).json({ message: "Data berhasil disimpan ke database" })
  } catch (error) {
    console.error("Gagal menyimpan data:", error)
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message })
  }
}
