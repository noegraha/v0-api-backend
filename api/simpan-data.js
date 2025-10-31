// api/simpan-data.js

import mysql from "mysql2/promise"

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader("Access-Control-Allow-Origin", "*") // Allow any origin
  // res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com') // Or restrict to specific domains
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  )

  // Handle OPTIONS request (preflight)
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }

  // Only allow POST requests for actual data processing
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

    // Log connection attempt
    console.log("Connecting to database...")

    // Create database connection with the correct port
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "337job.h.filess.io",
      port: 3306, // Add the port
      user: process.env.DB_USER || "didik_anak_platejarto",
      password: process.env.DB_PASSWORD || "92d2bcef0121274121b801e495adc80be49679f0",
      database: process.env.DB_NAME || "didik_anak_platejarto",
      connectTimeout: 15000,
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
        message: "Tidak dapat terhubung ke database - Database tidak dapat diakses",
        error: error.code,
        solution: "Periksa konfigurasi database dan pastikan port 3307 terbuka",
      })
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      res.status(500).json({
        message: "Akses ke database ditolak - Kredensial tidak valid",
        error: "Access denied",
        solution: "Periksa username dan password",
      })
    } else {
      res.status(500).json({
        message: "Terjadi kesalahan server",
        error: error.message,
        details: error.code,
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
