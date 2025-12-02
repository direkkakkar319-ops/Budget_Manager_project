'use strict'

function parseDate(d) {
    const x = new Date(d)
    if (isNaN(x.getTime())) return null
    return x
}

function toISODate(d) {
    return new Date(d).toISOString()
}

module.exports = { parseDate, toISODate }
