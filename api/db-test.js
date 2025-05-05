// api/db-test.js

import mysql from "mysql2/promise"

export default async function handler(req, res) {
  try {
    // Replace these with your actual database credentials
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "your-db-host.com",
      user: process.env.DB_USER || "your-username",
      password: process.env.DB_PASSWORD || "your-password",
      database: process.env.DB_NAME || "your-database",
      connectTimeout: 10000,
    })

    // If connection successful
    res.status(200).json({
      status: "success",
      message: "Database connection successful",
    })

    // Close connection
    await connection.end()
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: {
        code: error.code,
        message: error.message,
      },
    })
  }
}
