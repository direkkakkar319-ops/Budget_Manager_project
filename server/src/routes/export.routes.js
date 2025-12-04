'use strict'

const express = require('express')
const PDFDocument = require('pdfkit')
const Transaction = require('../models/Transaction')
const Budget = require('../models/Budget')
const { authenticate } = require('../middleware/auth')
const { toISODate } = require('../utils/dateUtils')

const router = express.Router()

// Export Data Endpoint
router.post('/', authenticate, async (req, res) => {
    try {
        const { format, type, startDate, endDate, includeSensitive } = req.body
        const userId = req.user.user_id
        const role = req.user.role

        // Build query
        const query = role === 'admin' ? {} : { user_id: userId }
        if (startDate || endDate) {
            query.date = {}
            if (startDate) query.date.$gte = toISODate(startDate)
            if (endDate) query.date.$lte = toISODate(endDate)
        }

        // Fetch data
        let data = []
        if (type === 'transactions') {
            data = await Transaction.find(query).lean()
        } else if (type === 'budgets') {
            const budgetQuery = role === 'admin' ? {} : { user_id: userId }
            if (startDate) budgetQuery.start_date = { $gte: toISODate(startDate) }
            if (endDate) budgetQuery.end_date = { $lte: toISODate(endDate) }
            data = await Budget.find(budgetQuery).lean()
        }

        if (format === 'pdf') {
            generatePDF(res, data, type, includeSensitive)
        } else if (format === 'csv') {
            generateCSV(res, data, type, includeSensitive)
        } else {
            res.status(400).json({ error: 'Invalid format' })
        }
    } catch (err) {
        console.error('Export error:', err)
        res.status(500).json({ error: 'Export failed' })
    }
})

function generatePDF(res, data, type, includeSensitive) {
    const doc = new PDFDocument({ margin: 50 })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="export-${type}-${Date.now()}.pdf"`)

    doc.pipe(res)

    // Header
    doc.fontSize(20).text('Budget Manager Export', { align: 'center' })
    doc.moveDown()
    doc.fontSize(12).text(`Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`, { align: 'left' })
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' })
    doc.moveDown()

    // Summary
    if (type === 'transactions') {
        const total = data.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
        doc.text(`Total Items: ${data.length}`)
        doc.text(`Net Balance: ${total.toFixed(2)}`)
    } else {
        doc.text(`Total Budgets: ${data.length}`)
    }
    doc.moveDown()

    // Table
    const startY = doc.y
    let currentY = startY

    if (type === 'transactions') {
        // Headers
        doc.font('Helvetica-Bold')
        doc.text('Date', 50, currentY)
        doc.text('Type', 150, currentY)
        doc.text('Category', 250, currentY)
        doc.text('Amount', 400, currentY)
        if (includeSensitive) doc.text('Notes', 500, currentY)

        currentY += 20
        doc.font('Helvetica')

        // Rows
        data.forEach(item => {
            if (currentY > 700) {
                doc.addPage()
                currentY = 50
            }
            doc.text(new Date(item.date).toLocaleDateString(), 50, currentY)
            doc.text(item.type, 150, currentY)
            doc.text(item.category_id, 250, currentY)
            doc.text(item.amount.toFixed(2), 400, currentY)
            if (includeSensitive) doc.text(item.notes || '-', 500, currentY)
            currentY += 20
        })
    }

    doc.end()
}

function generateCSV(res, data, type, includeSensitive) {
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="export-${type}-${Date.now()}.csv"`)

    let cols = []
    if (type === 'transactions') {
        cols = ['date', 'type', 'category_id', 'amount', 'currency']
        if (includeSensitive) cols.push('notes', 'vendor', 'client')
    } else {
        cols = ['category_id', 'amount', 'period', 'start_date', 'end_date']
    }

    const rows = [cols.join(',')]

    data.forEach(item => {
        const vals = cols.map(k => {
            let v = item[k]
            if (k.includes('date') && v) v = new Date(v).toISOString().split('T')[0]
            if (typeof v === 'string') v = `"${v.replace(/"/g, '""')}"`
            return v !== undefined ? v : ''
        })
        rows.push(vals.join(','))
    })

    res.send(rows.join('\n'))
}

module.exports = router
