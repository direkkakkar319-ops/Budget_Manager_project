'use strict'

const bcrypt = require('bcryptjs')
const User = require('../models/User')

async function seedUsers() {
    const count = await User.countDocuments()
    if (count) return
    const samples = [
        { email: 'admin@example.com', password: 'admin123', role: 'admin' },
        { email: 'cm_test@example.com', password: 'test_cm123', role: 'client_mgmt' },
        { email: 'salary@example.com', password: 'salary123', role: 'salary' },
        { email: 'self@example.com', password: 'self123', role: 'self_employed' },
        { email: 'acct@example.com', password: 'acct123', role: 'accountant' }
    ]
    for (const s of samples) {
        const hash = bcrypt.hashSync(s.password, 10)
        await User.create({ email: s.email, password_hash: hash, role: s.role })
    }
    console.log('Seeded sample users')
}

module.exports = seedUsers
