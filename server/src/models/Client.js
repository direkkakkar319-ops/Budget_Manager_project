'use strict'

const mongoose = require('mongoose')

const ClientSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    gstin: { type: String, default: '' },
    created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Client', ClientSchema)
