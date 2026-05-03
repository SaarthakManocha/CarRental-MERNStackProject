import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

import { connectDB } from './config/db.js'
import { getEnv } from './config/env.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import vehicleRoutes from './routes/vehicleRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const env = getEnv()
await connectDB(env.mongoUri)

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'car-rental-api' })
})

app.use('/api/auth', authRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/bookings', bookingRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`)
})
