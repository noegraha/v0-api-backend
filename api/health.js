export const runtime = 'nodejs';

export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    env: {
      DB_HOST: !!process.env.DB_HOST,
      DB_USER: !!process.env.DB_USER,
      DB_NAME: !!process.env.DB_NAME,
      DB_PORT: process.env.DB_PORT || '3306'
    }
  });
}
