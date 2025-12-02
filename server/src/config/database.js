'use strict'

const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/financeapp'

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
        console.log('✅ MongoDB connected successfully')
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message)
        console.error('Please check:')
        console.error('1. MongoDB Atlas password is correct')
        console.error('2. Your IP address is whitelisted in MongoDB Atlas Network Access')
        console.error('3. MongoDB Atlas cluster is running')
        console.error('\nServer will continue running but database operations will fail.')
    }
}

module.exports = connectDB
