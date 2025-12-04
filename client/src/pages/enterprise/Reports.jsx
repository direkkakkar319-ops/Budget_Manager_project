import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, FileText, DollarSign, Clock } from 'lucide-react'
import EnterpriseCard from '../../components/EnterpriseCard'

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
            <h1 className="text-2xl font-bold text-white">Financial Reports</h1>

            {/* Summary Cards */}
            <div className="dashboard-grid">
                <EnterpriseCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="text-emerald-400" />}
                    trend="+12.5%"
                />
                <EnterpriseCard
                    title="Pending Revenue"
                    value={`₹${pendingRevenue.toLocaleString()}`}
                    icon={<Clock className="text-orange-400" />}
                    subtext="Awaiting payment"
                />
                <EnterpriseCard
                    title="Total Invoices"
                    value={data.invoices.length}
                    icon={<FileText className="text-blue-400" />}
                    subtext="All time"
                />
                <EnterpriseCard
                    title="Overdue Invoices"
                    value={overdueInvoices}
                    icon={<TrendingUp className="text-red-400" />}
                    subtext="Requires attention"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Revenue Trend */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-white mb-4">Monthly Revenue Trend</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    formatter={(value) => `₹${value.toLocaleString()}`}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} name="Revenue" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Invoice Status Distribution */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-white mb-4">Invoice Status Distribution</h3>
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
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Clients by Revenue */}
                <div className="card lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-4">Top Clients by Revenue</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={clientRevenue}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    formatter={(value) => `₹${value.toLocaleString()}`}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
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
