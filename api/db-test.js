export const runtime = 'nodejs';

import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const started = Date.now();
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,                 // pastikan BUKAN DB_HOS
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || process.env.DB_PASS,
      database: process.env.DB_NAME,
      // ssl: { rejectUnauthorized: true }, // aktifkan jika DB mewajibkan SSL
      connectTimeout: 10000
    });

    const [rows] = await conn.query('SELECT 1 AS ok');
    await conn.end();

    res.status(200).json({
      ok: true,
      rows,
      elapsed_ms: Date.now() - started
    });
  } catch (e) {
    // Jangan biarkan throw keluar: log dan kirim JSON agar tidak FUNCTION_INVOCATION_FAILED
    console.error('[db-test] error:', e?.code, e?.message);
    res.status(500).json({
      ok: false,
      code: e?.code || null,
      error: e?.message || String(e),
      elapsed_ms: Date.now() - started
    });
  }
}
