'use strict'

const mongoose = require('mongoose')

const AuditSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String },
    ip: { type: String },
    path: { type: String },
    resource: { type: String },
    action: { type: String },
    status: { type: String, enum: ['allowed', 'denied'] },
    reason: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Audit', AuditSchema)
