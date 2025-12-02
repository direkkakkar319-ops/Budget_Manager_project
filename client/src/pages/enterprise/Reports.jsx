import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, FileText, DollarSign, Clock } from 'lucide-react'

export default function Reports() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        invoices: [],
        clients: [],
        monthlyRevenue: []
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [invoicesRes, clientsRes] = await Promise.all([
                    axios.get('http://localhost:3001/api/invoices', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    }),
                    axios.get('http://localhost:3001/api/clients', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    })
                ])

                // Calculate monthly revenue from invoices
                const invoices = invoicesRes.data
                const monthlyData = calculateMonthlyRevenue(invoices)

                setData({
                    invoices,
                    clients: clientsRes.data,
                    monthlyRevenue: monthlyData
                })
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [user])

    if (loading) return <div>Loading reports...</div>

    const totalRevenue = data.invoices
        .filter(i => i.status === 'paid')
        .reduce((acc, curr) => acc + curr.total, 0)

    const pendingRevenue = data.invoices
        .filter(i => i.status === 'sent' || i.status === 'overdue')
        .reduce((acc, curr) => acc + curr.total, 0)

    const overdueInvoices = data.invoices.filter(i => i.status === 'overdue').length

    // Invoice status breakdown
    const statusData = [
        { name: 'Paid', value: data.invoices.filter(i => i.status === 'paid').length, color: '#10b981' },
        { name: 'Sent', value: data.invoices.filter(i => i.status === 'sent').length, color: '#3b82f6' },
        { name: 'Draft', value: data.invoices.filter(i => i.status === 'draft').length, color: '#6b7280' },
        { name: 'Overdue', value: data.invoices.filter(i => i.status === 'overdue').length, color: '#ef4444' }
    ]

    // Top clients by revenue
    const clientRevenue = data.clients.map(client => {
        const revenue = data.invoices
            .filter(i => i.client_id?._id === client._id && i.status === 'paid')
            .reduce((acc, curr) => acc + curr.total, 0)
        return { name: client.name, revenue }
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="text-emerald-600" />}
                    trend="+12.5%"
                />
                <MetricCard
                    title="Pending Revenue"
                    value={`₹${pendingRevenue.toLocaleString()}`}
                    icon={<Clock className="text-orange-600" />}
                    subtext="Awaiting payment"
                />
                <MetricCard
                    title="Total Invoices"
                    value={data.invoices.length}
                    icon={<FileText className="text-blue-600" />}
                    subtext="All time"
                />
                <MetricCard
                    title="Overdue Invoices"
                    value={overdueInvoices}
                    icon={<TrendingUp className="text-red-600" />}
                    subtext="Requires attention"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Revenue Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} name="Revenue" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Invoice Status Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Invoice Status Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Clients by Revenue */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Top Clients by Revenue</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={clientRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                <Legend />
                                <Bar dataKey="revenue" fill="#2563eb" name="Revenue" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MetricCard({ title, value, icon, trend, subtext }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
                {trend && <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>}
            </div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
            {subtext && <div className="text-xs text-gray-500 mt-2">{subtext}</div>}
        </div>
    )
}

function calculateMonthlyRevenue(invoices) {
    const monthlyMap = {}
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // Initialize last 6 months
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${months[d.getMonth()]} ${d.getFullYear()}`
        monthlyMap[key] = 0
    }

    // Calculate revenue per month
    invoices.filter(i => i.status === 'paid').forEach(invoice => {
        const date = new Date(invoice.issue_date)
        const key = `${months[date.getMonth()]} ${date.getFullYear()}`
        if (monthlyMap[key] !== undefined) {
            monthlyMap[key] += invoice.total
        }
    })

    return Object.entries(monthlyMap).map(([month, revenue]) => ({
        month,
        revenue
    }))
}
