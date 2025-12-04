'use strict'

const express = require('express')
const Budget = require('../models/Budget')
const { authenticate, authorize } = require('../middleware/auth')
const { toISODate } = require('../utils/dateUtils')

const router = express.Router()
//router is a middleware function that is used to handle requests to a specific route.
//get request is used to retrieve a resource.
//post request is used to create a new resource .
//put request is used to update an existing resource.
//delete request is used to delete an existing resource.

// Get all budgets
router.get('/budgets', authenticate, authorize('budgets', 'view'), async (req, res) => {
    try {
        const match = req.user.role === 'admin' ? {} : { user_id: req.user.user_id }
        const budgets = await Budget.find(match).lean()
        res.json(budgets)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Create budget
router.post('/budgets', authenticate, authorize('budgets', 'create'), async (req, res) => {
    try {
        const body = req.body || {}
        if (!body.category_id || !body.start_date || !body.end_date) return res.status(400).json({ error: 'category_id, start_date, end_date required' })
        const b = await Budget.create({
            user_id: req.user.user_id,
            category_id: body.category_id,
            target: Number(body.target || 0),
            start_date: toISODate(body.start_date),
            end_date: toISODate(body.end_date),
            notes: body.notes || ''
        })
        res.status(201).json(b)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Update budget
router.put('/budgets/:id', authenticate, authorize('budgets', 'update'), async (req, res) => {
    try {
        const { id } = req.params
        const budget = await Budget.findById(id)
        if (!budget) return res.status(404).json({ error: 'Not found' })
        if (req.user.role !== 'admin' && budget.user_id.toString() !== req.user.user_id) return res.status(403).json({ error: 'forbidden' })

        const body = req.body || {}
        const updates = {
            category_id: body.category_id || budget.category_id,
            target: body.target !== undefined ? Number(body.target) : budget.target,
            start_date: body.start_date ? toISODate(body.start_date) : budget.start_date,
            end_date: body.end_date ? toISODate(body.end_date) : budget.end_date,
            notes: body.notes !== undefined ? body.notes : budget.notes
        }

        Object.assign(budget, updates)
        await budget.save()
        res.json(budget)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Delete budget
router.delete('/budgets/:id', authenticate, authorize('budgets', 'delete'), async (req, res) => {
    try {
        const { id } = req.params
        const budget = await Budget.findById(id)
        if (!budget) return res.status(404).json({ error: 'Not found' })
        if (req.user.role !== 'admin' && budget.user_id.toString() !== req.user.user_id) return res.status(403).json({ error: 'forbidden' })
        await Budget.findByIdAndDelete(id)
        res.json(budget)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
