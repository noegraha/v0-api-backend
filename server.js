import 'dotenv/config'
import express from 'express'
import handlerIndex from './api/index.js'
import handlerPing from './api/ping.js'
import handlerHealth from './api/health.js'
import handlerSimpan from './api/simpan-data.js'
import handlerGetQuote from './api/random-quote.js'
import handlerGetMotivation from './api/motivation-quote.js'
import handlerGetLaporan from './api/get-laporan.js'
import middleware from './api/_middleware.js'

const app = express()

// Parse JSON bodies
app.use(express.json())

// Apply your middleware (CORS, OPTIONS handling)
app.use((req, res, next) => middleware(req, res, next))

// Routes mapping to existing handlers
app.get('/api', (req, res) => handlerIndex(req, res))
app.get('/api/ping', (req, res) => handlerPing(req, res))
app.get('/api/health', (req, res) => handlerHealth(req, res))
app.get('/api/get-laporan', (req, res) => handlerGetLaporan(req, res))
app.get('/api/random-quote', (req, res) => handlerGetQuote(req, res))
app.get('/api/motivation-quote', (req, res) => handlerGetMotivation(req, res))
app.post('/api/simpan-data', (req, res) => handlerSimpan(req, res))
app.post('/api/puhser/simpan-data', (req, res) => handlerAuth(req, res))

const PORT = Number(process.env.PORT) || 3000
app.listen(PORT, () => console.log(`Server listening: http://localhost:${PORT}`))

export default app
