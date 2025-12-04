'use strict'

const mongoose = require('mongoose')

const BudgetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category_id: { type: String, required: true },
    target: { type: Number, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    notes: { type: String, default: '' },
    created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Budget', BudgetSchema)
