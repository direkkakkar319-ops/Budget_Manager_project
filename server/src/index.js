'use strict'

require('dotenv').config()

const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

// Import configuration
const connectDB = require('./config/database')
const seedUsers = require('./utils/seedUsers')

// Import routes
const authRoutes = require('./routes/auth.routes')
const staticRoutes = require('./routes/static.routes')
const transactionRoutes = require('./routes/transaction.routes')
const budgetRoutes = require('./routes/budget.routes')
const clientRoutes = require('./routes/client.routes')
const invoiceRoutes = require('./routes/invoice.routes')
const auditRoutes = require('./routes/audit.routes')
const exportRoutes = require('./routes/export.routes')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined'))

// Setup directories
const uploadsDir = path.join(__dirname, '..', 'uploads')
const publicDir = path.join(__dirname, '..', 'public')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

// Static file serving
app.use('/uploads', express.static(uploadsDir))
app.use('/', express.static(publicDir))

// Connect to database
connectDB()

// Seed users
seedUsers()

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api', staticRoutes)
app.use('/api', transactionRoutes)
app.use('/api', budgetRoutes)
app.use('/api', clientRoutes)
app.use('/api', invoiceRoutes)
app.use('/api', auditRoutes)
app.use('/api/export', exportRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})