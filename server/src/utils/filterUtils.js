'use strict'

const { parseDate } = require('./dateUtils')

function isIncome(t) { return t.type === 'income' }
function isExpense(t) { return t.type === 'expense' }

function applyFilters(list, query) {
    let out = list
    if (query.type) out = out.filter(t => t.type === query.type)
    if (query.account) out = out.filter(t => t.account === query.account)
    if (query.category_id) {
        const cats = query.category_id.split(',').map(s => s.trim()).filter(Boolean)
        if (cats.length > 0) out = out.filter(t => cats.includes(t.category_id))
    }
    if (query.tag) out = out.filter(t => Array.isArray(t.tags) && t.tags.includes(query.tag))
    if (query.reconciled !== undefined) {
        if (query.reconciled === 'true') out = out.filter(t => !!t.reconciled)
        if (query.reconciled === 'false') out = out.filter(t => !t.reconciled)
    }
    if (query.from) {
        const f = parseDate(query.from)
        if (f) out = out.filter(t => parseDate(t.date) >= f)
    }
    if (query.to) {
        const to = parseDate(query.to)
        if (to) out = out.filter(t => parseDate(t.date) <= to)
    }
    if (query.q) {
        const q = query.q.toLowerCase()
        out = out.filter(t =>
            (t.notes && t.notes.toLowerCase().includes(q)) ||
            (t.vendor && t.vendor.toLowerCase().includes(q)) ||
            (t.client && t.client.toLowerCase().includes(q)) ||
            (Array.isArray(t.tags) && t.tags.join(' ').toLowerCase().includes(q))
        )
    }
    return out
}

module.exports = { isIncome, isExpense, applyFilters }
