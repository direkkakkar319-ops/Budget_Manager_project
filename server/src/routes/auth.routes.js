'use strict'

const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { authenticate, JWT_SECRET } = require('../middleware/auth')

const router = express.Router()

router.post('/register', async (req, res) => {
    const { email, password, role } = req.body || {}
    if (!email || !password || !role) return res.status(400).json({ error: 'email, password, role required' })
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'email_exists' })
    const hash = bcrypt.hashSync(password, 10)
    const user = await User.create({ email, password_hash: hash, role })
    res.status(201).json({ id: user._id, email: user.email, role: user.role })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body || {}
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'unauthorized' })
    if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: 'unauthorized' })
    const token = jwt.sign({ user_id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '2h' })
    res.json({ token, role: user.role })
})

router.get('/me', authenticate, (req, res) => {
    res.json({ user_id: req.user.user_id, role: req.user.role, email: req.user.email })
})

module.exports = router
