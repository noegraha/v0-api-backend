// api/index.js
// This file will handle requests to /api/

export default function handler(req, res) {
  res.status(200).json({
    message: "API is running",
    endpoints: ["/api/simpan-data", "/api/test-db"],
    timestamp: new Date().toISOString(),
  })
}
