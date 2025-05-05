// api/dashboard.js

import fs from "fs"
import path from "path"

export default function handler(req, res) {
  try {
    // Read the HTML file
    const htmlPath = path.join(process.cwd(), "api", "dashboard.html")
    const html = fs.readFileSync(htmlPath, "utf8")

    // Set the content type and send the HTML
    res.setHeader("Content-Type", "text/html")
    res.status(200).send(html)
  } catch (error) {
    console.error("Error serving dashboard:", error)
    res.status(500).send("Error loading dashboard")
  }
}
