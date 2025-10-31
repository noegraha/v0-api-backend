// api/db-test.js

import mysql from "mysql2/promise"

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  try {
    // Replace these with your actual database credentials
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
