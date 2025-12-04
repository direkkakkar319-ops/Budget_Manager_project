'use strict'

const permissions = {
    dashboard: { view: ['admin', 'client_mgmt', 'self_employed', 'salary', 'accountant', 'viewer'] },
    transactions: {
        view: ['admin', 'client_mgmt', 'self_employed', 'salary', 'accountant', 'viewer'],
        create: ['admin', 'client_mgmt', 'self_employed', 'salary'],
        update: ['admin', 'client_mgmt', 'self_employed', 'salary'],
        delete: ['admin'],
        export: ['admin', 'client_mgmt', 'self_employed', 'accountant'],
        import: ['admin', 'client_mgmt', 'self_employed']
    },
    budgets: {
        view: ['admin', 'client_mgmt', 'self_employed', 'salary', 'accountant', 'viewer'],
        create: ['admin', 'client_mgmt', 'self_employed', 'salary'],
        update: ['admin', 'client_mgmt', 'self_employed', 'salary'],
        delete: ['admin']
    },
    clients: {
        view: ['admin', 'client_mgmt', 'self_employed', 'accountant'],
        create: ['admin', 'client_mgmt', 'self_employed'],
        update: ['admin', 'client_mgmt', 'self_employed'],
        delete: ['admin']
    },
    invoices: {
        view: ['admin', 'client_mgmt', 'self_employed', 'accountant'],
        detail: ['admin', 'client_mgmt', 'self_employed', 'accountant'],
        create: ['admin', 'client_mgmt', 'self_employed'],
        update: ['admin', 'client_mgmt', 'self_employed'],
        delete: ['admin']
    },
    audit: { view: ['admin'] }
}

module.exports = permissions
