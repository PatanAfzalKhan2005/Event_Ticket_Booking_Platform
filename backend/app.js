const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const limiter = require('./src/middleware/rateLimiter')
const { errorHandler } = require('./src/middleware/errorHandler')

const authRoutes = require('./src/routes/authRoutes')
const eventRoutes = require('./src/routes/eventRoutes')
const bookingRoutes = require('./src/routes/bookingRoutes')
const paymentRoutes = require('./src/routes/paymentRoutes')
const analyticsRoutes = require('./src/routes/analyticsRoutes')

const app = express()

app.use(
  cors({
    origin: true,
    credentials: true
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use(limiter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (req, res) => {
  res.json({ message: 'Event Ticket Booking API running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)

app.use(errorHandler)

module.exports = app
