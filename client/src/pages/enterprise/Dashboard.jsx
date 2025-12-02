import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Users, FileText, TrendingUp, AlertCircle } from 'lucide-react'

export default function EnterpriseDashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        totalRevenue: 0,
        outstandingInvoices: 0,
        activeClients: 0,
        monthlyRevenue: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Mock data fetching for now as backend dashboard endpoint is generic
        // In a real app, we'd have a dedicated enterprise stats endpoint
        const fetchStats = async () => {
            try {
                // Fetch clients count
                const clientsRes = await axios.get('http://localhost:3001/api/clients', {
                    headers: { Authorization: `Bearer ${user.token}` }
                })

                // Fetch invoices for revenue calc
                const invoicesRes = await axios.get('http://localhost:3001/api/invoices', {
                    headers: { Authorization: `Bearer ${user.token}` }
                })

                const invoices = invoicesRes.data
                const totalRevenue = invoices
                    .filter(i => i.status === 'paid')
                    .reduce((acc, curr) => acc + curr.total, 0)

                const outstanding = invoices
                    .filter(i => i.status === 'sent' || i.status === 'overdue')
                    .reduce((acc, curr) => acc + curr.total, 0)

                // Mock monthly data
                const monthlyRevenue = [
                    { name: 'Jan', revenue: 4000, expenses: 2400 },
                    { name: 'Feb', revenue: 3000, expenses: 1398 },
                    { name: 'Mar', revenue: 2000, expenses: 9800 },
                    { name: 'Apr', revenue: 2780, expenses: 3908 },
                    { name: 'May', revenue: 1890, expenses: 4800 },
                    { name: 'Jun', revenue: 2390, expenses: 3800 },
                ]

                setStats({
                    totalRevenue,
                    outstandingInvoices: outstanding,
                    activeClients: clientsRes.data.length,
                    monthlyRevenue
                })
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [user])

    if (loading) return <div>Loading...</div>

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Enterprise Overview</h1>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={<TrendingUp className="text-blue-600" />}
                    trend="+12.5% from last month"
                />
                <Card
                    title="Outstanding Invoices"
                    value={`₹${stats.outstandingInvoices.toLocaleString()}`}
                    icon={<AlertCircle className="text-orange-600" />}
                    subtext="Amount pending collection"
                />
                <Card
                    title="Active Clients"
                    value={stats.activeClients}
                    icon={<Users className="text-emerald-600" />}
                    subtext="Total active client base"
                />
                <Card
                    title="Invoices Generated"
                    value="124"
                    icon={<FileText className="text-purple-600" />}
                    subtext="This fiscal year"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#2563eb" name="Revenue" />
                                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Growth Trend</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Card({ title, value, icon, trend, subtext }) {
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
