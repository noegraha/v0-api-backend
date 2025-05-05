// api/simpan-data.js

import mysql from "mysql2/promise"

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  // Initialize connection variable outside try block to use in finally
  let connection

  try {
    console.log("Request received:", { method: req.method })

    // Extract data from request body
    const { data, hasil, tanggal } = req.body

    // Validate required fields
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

    // Log connection attempt (without exposing password)
    console.log("Connecting to database...")

    // Create database connection with shorter timeout
    connection = await mysql.createConnection({
      host: "panel.freehosting.com.",
      user: "noenotes_master",
      password: "Okeloh09.",
      database: "noenotes_master",
      connectTimeout: 5000, // Reduced timeout to fail faster
    })

    console.log("Database connection successful")

    // Create table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS laporan_kanker (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data_form JSON,
        hasil VARCHAR(20),
        tanggal DATETIME
      )
    `)

    console.log("Table verified/created")

    // Insert data into the table
    const [result] = await connection.execute(
      `INSERT INTO laporan_kanker (data_form, hasil, tanggal)
       VALUES (?, ?, ?)`,
      [
        JSON.stringify(data), // Store data as JSON string
        hasil,
        tanggal,
      ],
    )

    console.log("Data inserted successfully:", { insertId: result.insertId })

    // Return success response
    res.status(200).json({
      message: "Data berhasil disimpan ke database",
      insertId: result.insertId,
    })
  } catch (error) {
    // Log the full error for debugging
    console.error("Gagal menyimpan data:", error)

    // Return appropriate error message based on error type
    if (error.code === "ETIMEDOUT" || error.code === "ECONNREFUSED") {
      res.status(500).json({
        message: "Tidak dapat terhubung ke database - Database tidak dapat diakses dari Vercel",
        error: error.code,
        solution: "Gunakan database publik yang dapat diakses dari internet, bukan IP lokal (192.168.0.100)",
      })
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      res.status(500).json({
        message: "Akses ke database ditolak",
        error: "Access denied",
      })
    } else {
      res.status(500).json({
        message: "Terjadi kesalahan server",
        error: error.message,
      })
    }
  } finally {
    // Close the connection if it was established
    if (connection) {
      try {
        await connection.end()
        console.log("Database connection closed")
      } catch (err) {
        console.error("Error closing database connection:", err)
      }
    }
  }
}
