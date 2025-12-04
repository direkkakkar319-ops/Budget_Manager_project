'use strict'
//middleware is a function that has access to the request object, the response object, and the next middleware function in the application’s request-response cycle.
const jwt = require('jsonwebtoken')
const permissions = require('./permissions')
const { logAudit } = require('../utils/auditLogger')

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

function authenticate(req, res, next) {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const token = auth.slice(7)
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()// it is call next middleware
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' })
    }
}

function authorize(resource, action) {
    return async (req, res, next) => {
        const allowed = permissions[resource]?.[action] || []
        if (!allowed.includes(req.user.role)) {
            await logAudit(req, resource, action, 'denied', 'insufficient permissions')
            return res.status(403).json({ error: 'Forbidden' })
        }
        await logAudit(req, resource, action, 'allowed')
        next()
    }
}

module.exports = { authenticate, authorize, JWT_SECRET }
