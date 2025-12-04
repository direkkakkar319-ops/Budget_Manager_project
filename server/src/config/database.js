'use strict'

const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/financeapp'

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('MongoDB connected')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

module.exports = connectDB
