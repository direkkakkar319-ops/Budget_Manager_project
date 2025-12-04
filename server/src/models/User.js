'use strict'

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'client_mgmt', 'self_employed', 'salary', 'accountant', 'viewer'], default: 'salary' },
    created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)
