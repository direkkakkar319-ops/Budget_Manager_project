import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Wallet, Briefcase, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react'
import SelfEmployedHelpSection from '../../components/SelfEmployedHelpSection'
import ExportModal from '../../components/ExportModal'

export default function SelfEmployedDashboard() {
    const { user } = useAuth()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showExport, setShowExport] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch personal finance snapshot
                const res = await axios.get('http://localhost:3001/api/dashboard', {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
                setData(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [user])

    if (loading) return <div>Loading...</div>
    if (!data) return <div>Error loading data</div>

    return (
        <div className="space-y-8">
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-gradient font-extrabold tracking-tight text-3xl md:text-4xl lg:text-5xl">Freelance Overview</h2>
                    <p className="text-slate-400 mt-1">Your freelance business at a glance</p>
                </div>
                <button
                    onClick={() => setShowExport(true)}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-white/10"
                >
                    <Download size={18} />
                    Export Data
                </button>
            </header>

            {/* Hybrid Stats */}
            <div className="dashboard-grid">
                <StatCard
                    title="Personal Balance"
                    value={`₹${data.balance.toLocaleString()}`}
                    icon={<Wallet className="text-cyan-400" />}
                />
                <StatCard
                    title="Business Cashflow (30d)"
                    value={`₹${data.cashflow_30d.toLocaleString()}`}
                    icon={<Briefcase className="text-blue-400" />}
                />
                <StatCard
                    title="Net Income (90d)"
                    value={`₹${data.cashflow_90d.toLocaleString()}`}
                    icon={<ArrowUpRight className="text-emerald-400" />}
                />
                <StatCard
                    title="Pending Invoices"
                    value="₹12,500"
                    icon={<ArrowDownRight className="text-rose-400" />}
                    subtext="3 invoices overdue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions / Recent Activity */}
                <div className="lg:col-span-2 card">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {/* Mock Activity */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
                                        {i % 2 === 0 ? <Wallet size={18} /> : <Briefcase size={18} />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{i % 2 === 0 ? 'Grocery Shopping' : 'Client Payment Received'}</div>
                                        <div className="text-xs text-slate-500">Today, 10:23 AM</div>
                                    </div>
                                </div>
                                <div className={`font-bold ${i % 2 === 0 ? 'text-slate-300' : 'text-emerald-400'}`}>
                                    {i % 2 === 0 ? '-₹2,400' : '+₹15,000'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mini Budget Tracker */}
                <div className="card">
                    <h3 className="text-xl font-bold text-white mb-6">Budget Status</h3>
                    <div className="space-y-6">
                        {data.budgets.slice(0, 3).map((b, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white capitalize">{b.category_id}</span>
                                    <span className="text-cyan-400">₹{b.used} / ₹{b.target}</span>
                                </div>
                                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${b.progress > 100 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                                        style={{ width: `${Math.min(b.progress, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {data.budgets.length === 0 && <p className="text-slate-500 text-sm">No active budgets.</p>}
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <SelfEmployedHelpSection />

            {/* Export Modal */}
            <ExportModal open={showExport} onClose={() => setShowExport(false)} />
        </div>
    )
}

function StatCard({ title, value, icon, subtext }) {
    return (
        <div className="card transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <div className="text-2xl font-bold text-white">{value}</div>
            {subtext && <div className="text-xs text-slate-500 mt-2">{subtext}</div>}
        </div>
    )
}
