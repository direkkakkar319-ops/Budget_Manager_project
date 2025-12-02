'use strict'

const Audit = require('../models/Audit')

async function logAudit(req, resource, action, status, reason = '') {
    try {
        await Audit.create({
            user_id: req.user ? req.user.user_id : null,
            role: req.user ? req.user.role : null,
            ip: req.ip,
            path: req.originalUrl,
            resource,
            action,
            status,
            reason,
            timestamp: new Date()
        })
    } catch (err) {
        console.error('Audit log error:', err)
    }
}

module.exports = { logAudit }
