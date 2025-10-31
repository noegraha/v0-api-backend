// api/index.js
// This file will handle requests to /api/
import 'dotenv/config'
export const runtime = 'nodejs';
export default function handler(req, res) {
  res.status(200).json({
    message: "API is running",
    endpoints: ["/api/simpan-data", "/api/get-laporan"],
    timestamp: new Date().toISOString(),
  })
}
