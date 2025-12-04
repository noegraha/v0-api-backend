// api/index.js
// This file will handle requests to /api/
export const runtime = 'nodejs';
export default function handler(req, res) {
  res.status(200).json({
    message: "API is running",
    endpoints: ["/api/simpan-data", "/api/get-laporan", "/api/random-quote", "/api/motivation-quote", "/api/pusher/auth"],
    timestamp: new Date().toISOString(),
  })
}
