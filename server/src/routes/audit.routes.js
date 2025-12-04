'use strict'
//express is a web application framework for Node.js.it is used to build web applications and APIs.
const express = require('express')
const Audit = require('../models/Audit')
const { authenticate, authorize } = require('../middleware/auth')

const router = express.Router()

// Get audit logs
router.get('/audit', authenticate, authorize('audit', 'view'), async (req, res) => {
    try {
        const logs = await Audit.find().sort({ timestamp: -1 }).limit(100).lean()
        res.json(logs)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
