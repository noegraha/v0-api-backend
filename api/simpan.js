// api/simpan.js

import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { data, hasil, tanggal } = req.body;

    if (!data || !hasil || !tanggal) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    // Koneksi ke MySQL (gunakan environment variables dari Vercel)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Buat tabel jika belum ada (mengikuti struktur kamu)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS laporan_kanker (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data_form JSON,
        hasil VARCHAR(20),
        tanggal DATETIME
      )
    `);

    // Simpan data
    await connection.execute(
      `INSERT INTO laporan_kanker (data_form, hasil, tanggal)
       VALUES (?, ?, ?)`,
      [
        JSON.stringify(data), // simpan data form sebagai JSON
        hasil,
        tanggal,
      ]
    );

    res.status(200).json({ message: 'Data berhasil disimpan ke database' });
  } catch (error) {
    console.error('Gagal menyimpan data:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
}
