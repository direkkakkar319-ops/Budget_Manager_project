'use strict'

const express = require('express')
const path = require('path')
const fs = require('fs')
const Transaction = require('../models/Transaction')
const Budget = require('../models/Budget')
const { authenticate, authorize } = require('../middleware/auth')
const { upload, uploadsDir } = require('../config/multer')
const { toISODate } = require('../utils/dateUtils')
const { applyFilters } = require('../utils/filterUtils')

const router = express.Router()

// Dashboard snapshot calculation
async function calcSnapshot(userId, role) {
    const now = new Date()
    const days30 = new Date(now.getTime() - 30 * 86400000)
    const days90 = new Date(now.getTime() - 90 * 86400000)
    const match = role === 'admin' ? {} : { user_id: userId }
    const tx = await Transaction.find(match).lean()
    const tx30 = tx.filter(t => new Date(t.date) >= days30)
    const tx90 = tx.filter(t => new Date(t.date) >= days90)
    const sum = arr => arr.reduce((a, b) => a + b, 0)
    const incomeTotal = sum(tx.filter(t => t.type === 'income').map(t => t.amount))
    const expenseTotal = sum(tx.filter(t => t.type === 'expense').map(t => t.amount))
    const balance = incomeTotal - expenseTotal
    const cash30 = sum(tx30.filter(t => t.type === 'income').map(t => t.amount)) - sum(tx30.filter(t => t.type === 'expense').map(t => t.amount))
    const cash90 = sum(tx90.filter(t => t.type === 'income').map(t => t.amount)) - sum(tx90.filter(t => t.type === 'expense').map(t => t.amount))
    const upcomingBills = tx.filter(t => t.type === 'expense' && new Date(t.date) > now)
    const budgets = await Budget.find(match).lean()
    const budgetsWithProgress = await Promise.all(budgets.map(async b => {
        const used = await Transaction.aggregate([
            { $match: { user_id: role === 'admin' ? {} : userId, category_id: b.category_id, type: 'expense', date: { $gte: b.start_date, $lte: b.end_date } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
        const total = used.length ? used[0].total : 0
        return { ...b, used: total, progress: b.target ? Math.min(100, Math.round((total / b.target) * 100)) : 0 }
    }))
    return { balance, cashflow_30d: cash30, cashflow_90d: cash90, upcoming_bills: upcomingBills.length, budgets: budgetsWithProgress }
}

// Dashboard
router.get('/dashboard', authenticate, authorize('dashboard', 'view'), async (req, res) => {
    try {
        const snapshot = await calcSnapshot(req.user.user_id, req.user.role)
        res.json(snapshot)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get all transactions
router.get('/transactions', authenticate, authorize('transactions', 'view'), async (req, res) => {
    try {
        const match = req.user.role === 'admin' ? {} : { user_id: req.user.user_id }
        let transactions = await Transaction.find(match).lean()
        transactions = applyFilters(transactions, req.query)
        res.json(transactions)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Create transaction
router.post('/transactions', authenticate, authorize('transactions', 'create'), upload.single('receipt'), async (req, res) => {
    try {
        const body = req.body || {}
        const isMultipart = !!req.file
        const amount = Number(body.amount || 0)
        if (!amount || !body.type) return res.status(400).json({ error: 'amount and type are required' })
        const t = await Transaction.create({
            user_id: req.user.user_id,
            date: body.date ? toISODate(body.date) : new Date(),
            amount,
            currency: body.currency || 'INR',
            type: body.type,
            category_id: body.category_id || (body.type === 'income' ? 'income' : 'expense'),
            account: body.account || 'Cash',
            tags: body.tags ? (Array.isArray(body.tags) ? body.tags : String(body.tags).split(',').map(s => s.trim()).filter(Boolean)) : [],
            vendor: body.vendor || '',
            client: body.client || '',
            project_id: body.project_id || '',
            invoice_id: body.invoice_id || '',
            receipt_url: isMultipart && req.file ? `/uploads/${req.file.filename}` : (body.receipt_url || ''),
            reconciled: body.reconciled === 'true' || body.reconciled === true || false,
            notes: body.notes || '',
            splits: body.splits ? JSON.parse(body.splits) : []
        })
        res.status(201).json(t)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Update transaction
router.put('/transactions/:id', authenticate, authorize('transactions', 'update'), upload.single('receipt'), async (req, res) => {
    try {
        const { id } = req.params
        const transaction = await Transaction.findById(id)
        if (!transaction) return res.status(404).json({ error: 'Not found' })
        if (req.user.role !== 'admin' && transaction.user_id.toString() !== req.user.user_id) return res.status(403).json({ error: 'forbidden' })

        const body = req.body || {}
        const updates = {
            date: body.date ? toISODate(body.date) : transaction.date,
            amount: body.amount !== undefined ? Number(body.amount) : transaction.amount,
            currency: body.currency || transaction.currency,
            type: body.type || transaction.type,
            category_id: body.category_id || transaction.category_id,
            account: body.account || transaction.account,
            tags: body.tags ? (Array.isArray(body.tags) ? body.tags : String(body.tags).split(',').map(s => s.trim()).filter(Boolean)) : transaction.tags,
            vendor: body.vendor !== undefined ? body.vendor : transaction.vendor,
            client: body.client !== undefined ? body.client : transaction.client,
            project_id: body.project_id !== undefined ? body.project_id : transaction.project_id,
            invoice_id: body.invoice_id !== undefined ? body.invoice_id : transaction.invoice_id,
            receipt_url: req.file ? `/uploads/${req.file.filename}` : (body.receipt_url !== undefined ? body.receipt_url : transaction.receipt_url),
            reconciled: body.reconciled !== undefined ? (body.reconciled === 'true' || body.reconciled === true) : transaction.reconciled,
            notes: body.notes !== undefined ? body.notes : transaction.notes,
            splits: body.splits ? JSON.parse(body.splits) : transaction.splits
        }

        Object.assign(transaction, updates)
        await transaction.save()
        res.json(transaction)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Delete transaction
router.delete('/transactions/:id', authenticate, authorize('transactions', 'delete'), async (req, res) => {
    try {
        const { id } = req.params
        const transaction = await Transaction.findById(id)
        if (!transaction) return res.status(404).json({ error: 'Not found' })
        if (req.user.role !== 'admin' && transaction.user_id.toString() !== req.user.user_id) return res.status(403).json({ error: 'forbidden' })
        await Transaction.findByIdAndDelete(id)
        res.json(transaction)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Export transactions to CSV
router.get('/transactions/export.csv', authenticate, authorize('transactions', 'export'), async (req, res) => {
    try {
        const cols = ['_id', 'date', 'amount', 'currency', 'type', 'category_id', 'account', 'tags', 'vendor', 'client', 'project_id', 'invoice_id', 'receipt_url', 'reconciled', 'notes']
        const rows = [cols.join(',')]
        const match = req.user.role === 'admin' ? {} : { user_id: req.user.user_id }
        const items = await Transaction.find(match).lean()
        items.forEach(t => {
            const vals = cols.map(k => {
                let v = t[k]
                if (Array.isArray(v)) v = v.join('|')
                if (typeof v === 'string') {
                    v = '"' + v.replace(/"/g, '""') + '"'
                }
                return v
            })
            rows.push(vals.join(','))
        })
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"')
        res.send(rows.join('\n'))
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Import transactions from CSV
router.post('/transactions/import.csv', authenticate, authorize('transactions', 'import'), upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'CSV file required' })
        const csv = fs.readFileSync(path.join(uploadsDir, req.file.filename), 'utf8')
        const lines = csv.split(/\r?\n/).filter(Boolean)
        if (lines.length < 2) return res.status(400).json({ error: 'No rows' })
        const header = lines[0].split(',').map(h => h.replace(/^"|"$/g, ''))
        let imported = 0
        for (let i = 1; i < lines.length; i++) {
            const raw = lines[i]
            const parts = []
            let cur = ''
            let inQuotes = false
            for (let ch of raw) {
                if (ch === '"') { inQuotes = !inQuotes; continue }
                if (ch === ',' && !inQuotes) { parts.push(cur); cur = ''; continue }
                cur += ch
            }
            parts.push(cur)
            const obj = {}
            header.forEach((h, idx) => { obj[h] = parts[idx] })
            const t = await Transaction.create({
                user_id: req.user.user_id,
                date: obj.date ? new Date(obj.date) : new Date(),
                amount: Number(obj.amount || 0),
                currency: obj.currency || 'INR',
                type: obj.type || 'expense',
                category_id: obj.category_id || 'expense',
                account: obj.account || 'Cash',
                tags: obj.tags ? obj.tags.split('|').filter(Boolean) : [],
                vendor: obj.vendor || '',
                client: obj.client || '',
                project_id: obj.project_id || '',
                invoice_id: obj.invoice_id || '',
                receipt_url: obj.receipt_url || '',
                reconciled: obj.reconciled === 'true',
                notes: obj.notes || ''
            })
            if (t.amount) imported++
        }
        res.json({ imported })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
