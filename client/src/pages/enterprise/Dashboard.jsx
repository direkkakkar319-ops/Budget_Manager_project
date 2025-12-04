import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Users, FileText, TrendingUp, AlertCircle, Download } from 'lucide-react'
import EnterpriseHelpSection from '../../components/EnterpriseHelpSection'
import ExportModal from '../../components/ExportModal'
import EnterpriseCard from '../../components/EnterpriseCard'

export default function EnterpriseDashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        totalRevenue: 0,
        outstandingInvoices: 0,
        activeClients: 0,
        monthlyRevenue: []
    })
    const [loading, setLoading] = useState(true)
    const [showExport, setShowExport] = useState(false)

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
        <div className="space-y-8">
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-gradient font-extrabold tracking-tight text-3xl md:text-4xl lg:text-5xl">Enterprise Overview</h2>
                    <p className="text-slate-400 mt-1">Manage your business operations</p>
                </div>
                <button
                    onClick={() => setShowExport(true)}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-white/10"
                >
                    <Download size={18} />
                    Export Data
                </button>
            </header>

            {/* Metrics Cards */}
            <div className="dashboard-grid">
                <EnterpriseCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={<TrendingUp className="text-cyan-400" />}
                    trend="+12.5% from last month"
                />
                <EnterpriseCard
                    title="Outstanding Invoices"
                    value={`₹${stats.outstandingInvoices.toLocaleString()}`}
                    icon={<AlertCircle className="text-rose-400" />}
                    subtext="Amount pending collection"
                />
                <EnterpriseCard
                    title="Active Clients"
                    value={stats.activeClients}
                    icon={<Users className="text-emerald-400" />}
                    subtext="Total active client base"
                />
                <EnterpriseCard
                    title="Invoices Generated"
                    value="124"
                    icon={<FileText className="text-blue-400" />}
                    subtext="This fiscal year"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                    <h3 className="text-xl font-bold text-white mb-4">Revenue vs Expenses</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Bar dataKey="revenue" fill="#06b6d4" name="Revenue" />
                                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-xl font-bold text-white mb-4">Growth Trend</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <EnterpriseHelpSection />

            {/* Export Modal */}
            <ExportModal open={showExport} onClose={() => setShowExport(false)} />
        </div>
    )
}


