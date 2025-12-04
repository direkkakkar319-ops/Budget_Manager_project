'use strict'

const mongoose = require('mongoose')

const InvoiceSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    invoice_number: { type: String, unique: true, required: true },
    status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'], default: 'draft' },
    issue_date: { type: Date, required: true },
    due_date: { type: Date, required: true },
    subtotal: { type: Number, required: true },
    tax_rate: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    notes: { type: String, default: '' },
    items: [{
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        rate: { type: Number, required: true },
        amount: { type: Number, required: true },
        tax_rate: { type: Number, default: 0 }
    }],
    created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Invoice', InvoiceSchema)
