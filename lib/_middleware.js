// api/_middleware.js
// This file will add CORS headers to all API routes
export const runtime = 'nodejs';

export default function middleware(req, res, next) {
  // Add CORS headers to all responses
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader("Access-Control-Allow-Origin", "*") // Allow any origin
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

  // Continue to the actual route handler
  return next()
}
