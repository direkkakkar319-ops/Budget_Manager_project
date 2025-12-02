'use strict'

const express = require('express')
const Invoice = require('../models/Invoice')
const { authenticate, authorize } = require('../middleware/auth')
const { toISODate } = require('../utils/dateUtils')

const router = express.Router()

// Get all invoices
router.get('/invoices', authenticate, authorize('invoices', 'view'), async (req, res) => {
    try {
        let match = {}
        if (req.user.role !== 'admin' && req.user.role !== 'client_mgmt') {
            match = { user_id: req.user.user_id }
        }
        const invoices = await Invoice.find(match).populate('client_id', 'name email').lean()
        res.json(invoices)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get invoice by ID
router.get('/invoices/:id', authenticate, authorize('invoices', 'detail'), async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('client_id').lean()
        if (!invoice) return res.status(404).json({ error: 'Not found' })
        if (req.user.role !== 'admin' && req.user.role !== 'client_mgmt' && invoice.user_id.toString() !== req.user.user_id) return res.status(403).json({ error: 'forbidden' })
        res.json(invoice)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Create invoice
router.post('/invoices', authenticate, authorize('invoices', 'create'), async (req, res) => {
    try {
        const body = req.body || {}
        if (!body.client_id || !body.invoice_number || !body.issue_date || !body.due_date || !body.items) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        // Calculate totals
        const items = Array.isArray(body.items) ? body.items : []
        let subtotal = 0
        let totalTax = 0
        const processedItems = items.map(item => {
            const amount = Number(item.quantity) * Number(item.rate)
            const tax = amount * (Number(item.tax_rate) / 100)
            subtotal += amount
            totalTax += tax
            return { ...item, amount, tax_rate: Number(item.tax_rate) }
        })

        const total = subtotal + totalTax

        const invoice = await Invoice.create({
            user_id: req.user.user_id,
            client_id: body.client_id,
            invoice_number: body.invoice_number,
            status: body.status || 'draft',
            issue_date: toISODate(body.issue_date),
            due_date: toISODate(body.due_date),
            subtotal,
            tax_rate: 0, // Individual item tax used
            tax_amount: totalTax,
            total,
            currency: body.currency || 'INR',
            notes: body.notes || '',
            items: processedItems
        })
        res.status(201).json(invoice)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Update invoice
router.put('/invoices/:id', authenticate, authorize('invoices', 'update'), async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
        if (!invoice) return res.status(404).json({ error: 'Not found' })
        if (req.user.role !== 'admin' && req.user.role !== 'client_mgmt' && invoice.user_id.toString() !== req.user.user_id) return res.status(403).json({ error: 'forbidden' })

        const body = req.body || {}

        if (body.items) {
            const items = Array.isArray(body.items) ? body.items : []
            let subtotal = 0
            let totalTax = 0
            const processedItems = items.map(item => {
                const amount = Number(item.quantity) * Number(item.rate)
                const tax = amount * (Number(item.tax_rate) / 100)
                subtotal += amount
                totalTax += tax
                return { ...item, amount, tax_rate: Number(item.tax_rate) }
            })
            invoice.items = processedItems
            invoice.subtotal = subtotal
            invoice.tax_amount = totalTax
            invoice.total = subtotal + totalTax
        }

        if (body.status) invoice.status = body.status
        if (body.issue_date) invoice.issue_date = toISODate(body.issue_date)
        if (body.due_date) invoice.due_date = toISODate(body.due_date)
        if (body.notes !== undefined) invoice.notes = body.notes

        await invoice.save()
        res.json(invoice)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Delete invoice
router.delete('/invoices/:id', authenticate, authorize('invoices', 'delete'), async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
        if (!invoice) return res.status(404).json({ error: 'Not found' })
        if (req.user.role !== 'admin' && req.user.role !== 'client_mgmt' && invoice.user_id.toString() !== req.user.user_id) return res.status(403).json({ error: 'forbidden' })
        await Invoice.findByIdAndDelete(req.params.id)
        res.json(invoice)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
