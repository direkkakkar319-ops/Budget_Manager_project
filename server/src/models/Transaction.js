'use strict'

const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category_id: { type: String, required: true },
    account: { type: String, default: 'Cash' },
    tags: [{ type: String }],
    vendor: { type: String, default: '' },
    client: { type: String, default: '' },
    project_id: { type: String, default: '' },
    invoice_id: { type: String, default: '' },
    receipt_url: { type: String, default: '' },
    reconciled: { type: Boolean, default: false },
    notes: { type: String, default: '' },
    splits: { type: mongoose.Schema.Types.Mixed, default: [] }
})

module.exports = mongoose.model('Transaction', TransactionSchema)
