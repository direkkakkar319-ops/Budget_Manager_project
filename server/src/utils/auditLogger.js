'use strict'
//util is a module that provides utility functions for working with files and directories.
const Audit = require('../models/Audit')

async function logAudit(req, resource, action, status, reason = '') {
    try {
        await Audit.create({ //this is create audit log
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
