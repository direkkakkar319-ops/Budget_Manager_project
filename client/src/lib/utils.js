import { clsx } from "clsx"

export function cn(...inputs) {
    return clsx(inputs)
}

export function formatCurrency(amount, currency = 'INR') {
    if (typeof amount !== 'number') return '₹0'

    const symbol = currency === 'INR' ? '₹' : '$'
    return `${symbol}${amount.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`
}

export function formatDate(date, format = 'short') {
    if (!date) return ''

    const d = new Date(date)
    if (isNaN(d.getTime())) return ''

    if (format === 'short') {
        return d.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    } else if (format === 'long') {
        return d.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        })
    } else if (format === 'input') {
        // Format for HTML date input (YYYY-MM-DD)
        return d.toISOString().split('T')[0]
    }

    return d.toLocaleDateString('en-IN')
}

export function debounce(fn, delay = 300) {
    let timeoutId
    return function (...args) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn.apply(this, args), delay)
    }
}

export function calculatePercentage(value, total) {
    if (!total || total === 0) return 0
    return Math.round((value / total) * 100)
}

export function groupByCategory(transactions) {
    const grouped = {}

    transactions.forEach(transaction => {
        const category = transaction.category_id || 'uncategorized'
        if (!grouped[category]) {
            grouped[category] = {
                category,
                transactions: [],
                total: 0,
                count: 0
            }
        }

        grouped[category].transactions.push(transaction)
        grouped[category].total += transaction.amount
        grouped[category].count += 1
    })

    return Object.values(grouped)
}

export function groupByMonth(transactions) {
    const grouped = {}
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    transactions.forEach(transaction => {
        const date = new Date(transaction.date)
        const key = `${months[date.getMonth()]} ${date.getFullYear()}`

        if (!grouped[key]) {
            grouped[key] = {
                month: key,
                income: 0,
                expense: 0,
                transactions: []
            }
        }

        grouped[key].transactions.push(transaction)
        if (transaction.type === 'income') {
            grouped[key].income += transaction.amount
        } else {
            grouped[key].expense += transaction.amount
        }
    })

    return Object.values(grouped)
}

export function exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) {
        console.error('No data to export')
        return
    }

    // Get headers from first object
    const headers = Object.keys(data[0])

    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                let value = row[header]

                // Handle arrays
                if (Array.isArray(value)) {
                    value = value.join('|')
                }

                // Handle objects
                if (typeof value === 'object' && value !== null) {
                    value = JSON.stringify(value)
                }

                // Escape quotes and wrap in quotes if contains comma
                if (typeof value === 'string') {
                    value = value.replace(/"/g, '""')
                    if (value.includes(',') || value.includes('\n')) {
                        value = `"${value}"`
                    }
                }

                return value
            }).join(',')
        )
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export function parseCSV(csvText) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
    const data = []

    for (let i = 1; i < lines.length; i++) {
        const values = []
        let current = ''
        let inQuotes = false

        for (let char of lines[i]) {
            if (char === '"') {
                inQuotes = !inQuotes
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim())
                current = ''
            } else {
                current += char
            }
        }
        values.push(current.trim())

        const row = {}
        headers.forEach((header, index) => {
            row[header] = values[index] || ''
        })
        data.push(row)
    }

    return data
}

export function getStatusColor(status) {
    const colors = {
        paid: 'text-green-600 bg-green-50',
        sent: 'text-blue-600 bg-blue-50',
        draft: 'text-gray-600 bg-gray-50',
        overdue: 'text-red-600 bg-red-50',
        cancelled: 'text-orange-600 bg-orange-50',
        pending: 'text-yellow-600 bg-yellow-50',
        active: 'text-green-600 bg-green-50',
        inactive: 'text-gray-600 bg-gray-50'
    }

    return colors[status] || 'text-gray-600 bg-gray-50'
}

export function truncate(str, length = 50) {
    if (!str) return ''
    if (str.length <= length) return str
    return str.substring(0, length) + '...'
}

export function capitalize(str) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getInitials(name) {
    if (!name) return '??'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
        const aVal = a[key]
        const bVal = b[key]

        if (aVal === bVal) return 0

        if (order === 'asc') {
            return aVal > bVal ? 1 : -1
        } else {
            return aVal < bVal ? 1 : -1
        }
    })
}

export function filterBy(array, filters) {
    return array.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
            if (value === null || value === undefined || value === '') return true

            if (Array.isArray(value)) {
                return value.includes(item[key])
            }

            return item[key] === value
        })
    })
}

export function sumBy(array, key) {
    return array.reduce((sum, item) => sum + (Number(item[key]) || 0), 0)
}

export function getDateRange(period) {
    const now = new Date()
    const ranges = {
        today: {
            from: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            to: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
        },
        yesterday: {
            from: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
            to: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59)
        },
        thisWeek: {
            from: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()),
            to: now
        },
        thisMonth: {
            from: new Date(now.getFullYear(), now.getMonth(), 1),
            to: now
        },
        lastMonth: {
            from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
            to: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
        },
        thisYear: {
            from: new Date(now.getFullYear(), 0, 1),
            to: now
        },
        last30Days: {
            from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
            to: now
        },
        last90Days: {
            from: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
            to: now
        }
    }

    return ranges[period] || ranges.thisMonth
}

export function isOverdue(dueDate) {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
}

export function getDaysUntil(date) {
    if (!date) return null
    const now = new Date()
    const target = new Date(date)
    const diff = target - now
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

export function validatePhone(phone) {
    const re = /^[0-9]{10}$/
    return re.test(phone.replace(/\D/g, ''))
}

export function generateInvoiceNumber(prefix = 'INV') {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `${prefix}-${year}${month}-${random}`
}
