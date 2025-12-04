'use strict'

const express = require('express')
const Client = require('../models/Client')
const { authenticate, authorize } = require('../middleware/auth')

const router = express.Router()

// Get all clients
router.get('/clients', authenticate, authorize('clients', 'view'), async (req, res) => {
    try {
        let match = {}
        if (req.user.role !== 'admin' && req.user.role !== 'client_mgmt') {
            match = { user_id: req.user.user_id }
        }
        const clients = await Client.find(match).lean()
        res.json(clients)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get client by ID
router.get('/clients/:id', authenticate, authorize('clients', 'detail'), async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).lean()
        if (!client) return res.status(404).json({ error: 'Not found' })
        if (req.user.role !== 'admin' && req.user.role !== 'client_mgmt' && client.user_id.toString() !== req.user.user_id) return res.status(403).json({ error: 'forbidden' })
        res.json(client)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Create client
router.post('/clients', authenticate, authorize('clients', 'create'), async (req, res) => {
    try {
        const { name, email, phone, address, gstin } = req.body || {}
        if (!name) return res.status(400).json({ error: 'name required' })
        const c = await Client.create({
            user_id: req.user.user_id,
            name,
            email: email || '',
            phone: phone || '',
            address: address || '',
            gstin: gstin || ''
        })
        res.status(201).json(c)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Update client
router.put('/clients/:id', authenticate, authorize('clients', 'update'), async (req, res) => {
    try {
        const client = await Client.findById(req.params.id)
        if (!client) return res.status(404).json({ error: 'Not found' })
        if (req.user.role !== 'admin' && req.user.role !== 'client_mgmt' && client.user_id.toString() !== req.user.user_id) return res.status(403).json({ error: 'forbidden' })

        const { name, email, phone, address, gstin } = req.body || {}
        const updates = {
            name: name !== undefined ? name : client.name,
            email: email !== undefined ? email : client.email,
            phone: phone !== undefined ? phone : client.phone,
            address: address !== undefined ? address : client.address,
            gstin: gstin !== undefined ? gstin : client.gstin
        }

        Object.assign(client, updates)
        await client.save()
        res.json(client)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Delete client
router.delete('/clients/:id', authenticate, authorize('clients', 'delete'), async (req, res) => {
    try {
        const client = await Client.findById(req.params.id)
        if (!client) return res.status(404).json({ error: 'Not found' })
        if (req.user.role !== 'admin' && req.user.role !== 'client_mgmt' && client.user_id.toString() !== req.user.user_id) return res.status(403).json({ error: 'forbidden' })
        await Client.findByIdAndDelete(req.params.id)
        res.json(client)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
