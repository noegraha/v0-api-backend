// api/test-connection.js

import mysql from "mysql2/promise"

export default async function handler(req, res) {
  let connection

  try {
    console.log("Testing database connection with:", {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
    })

    // Try to connect
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000,
    })

    // If we get here, connection was successful
    res.status(200).json({
      status: "success",
      message: "Database connection successful",
      connection: {
        threadId: connection.threadId,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: {
        code: error.code,
        message: error.message,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage,
      },
    })
  } finally {
    if (connection) {
      try {
        await connection.end()
      } catch (err) {
        console.error("Error closing connection:", err)
      }
    }
  }
}
