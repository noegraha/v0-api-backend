// api/test-db.js

import mysql from "mysql2/promise"

export default async function handler(req, res) {
  let connection

  try {
    console.log("Testing database connection with filess.io...")

    // Create connection with the correct port
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "m7h7s.h.filess.io",
      port: 3307, // This is crucial - your database uses port 3307
      user: process.env.DB_USER || "master_twiceuseat",
      password: process.env.DB_PASSWORD || "4ea92b414b3383fbec0e0e7d91cdd623066dace8",
      database: process.env.DB_NAME || "master_twiceuseat",
      connectTimeout: 15000,
    })

    // Run a simple query to test the connection
    const [rows] = await connection.execute("SELECT 1+1 AS result")

    // Return success response
    res.status(200).json({
      status: "success",
      message: "Database connection successful",
      result: rows[0],
      connection: {
        threadId: connection.threadId,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
      },
    })
  } catch (error) {
    console.error("Database connection error:", error)

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
        console.log("Database connection closed")
      } catch (err) {
        console.error("Error closing connection:", err)
      }
    }
  }
}
