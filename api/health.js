export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    // Don't include sensitive information
    database: {
      host: process.env.DB_HOST ? "configured" : "missing",
      user: process.env.DB_USER ? "configured" : "missing",
      database: process.env.DB_NAME ? "configured" : "missing",
      password: process.env.DB_PASSWORD ? "configured" : "missing",
    },
  })
}
