import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Skeleton } from '../../components/ui/Skeleton'
import { ArrowUpRight, ArrowDownRight, Wallet, Calendar } from 'lucide-react'

export default function SalaryDashboard() {
    const { user } = useAuth()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
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

    if (loading) return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-40 mt-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-8 w-32 mt-4" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                    <Skeleton className="h-6 w-40 mb-6" />
                    <Skeleton className="h-40 w-full" />
                </div>
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
        </div>
    )
    if (!data) return <div className="text-white">Error loading data</div>

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-bold text-white">Welcome back, Salary Person</h2>
                <p className="text-slate-400">Here's your financial overview</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Balance"
                    value={`₹${data.balance.toLocaleString()}`}
                    icon={<Wallet className="text-cyan-400" />}
                    trend={data.cashflow_30d > 0 ? 'positive' : 'negative'}
                />
                <StatCard
                    title="30 Day Cashflow"
                    value={`₹${data.cashflow_30d.toLocaleString()}`}
                    icon={<ArrowUpRight className="text-emerald-400" />}
                    subtext="Net income last 30 days"
                />
                <StatCard
                    title="90 Day Cashflow"
                    value={`₹${data.cashflow_90d.toLocaleString()}`}
                    icon={<ArrowUpRight className="text-blue-400" />}
                    subtext="Net income last 90 days"
                />
                <StatCard
                    title="Upcoming Bills"
                    value={data.upcoming_bills}
                    icon={<Calendar className="text-rose-400" />}
                    subtext="Bills due soon"
                />
            </div>

            {/* Budgets & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Budget Progress */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Budget Progress</h3>
                    <div className="space-y-6">
                        {data.budgets.map((b, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white font-medium capitalize">{b.category_id}</span>
                                    <span className="text-slate-400">₹{b.used} / ₹{b.target}</span>
                                </div>
                                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${b.progress > 100 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                                        style={{ width: `${Math.min(b.progress, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {data.budgets.length === 0 && <p className="text-slate-500">No budgets set.</p>}
                    </div>
                </div>

                {/* Mini Chart (Mock for visual) */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-4">Cashflow Trend</h3>
                    <div className="flex-1 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'M', val: 400 }, { name: 'T', val: 300 }, { name: 'W', val: 600 },
                                { name: 'T', val: 200 }, { name: 'F', val: 500 }, { name: 'S', val: 400 }, { name: 'S', val: 700 }
                            ]}>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                                    {
                                        [0, 1, 2, 3, 4, 5, 6].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#3b82f6'} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, subtext, trend }) {
    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-slate-800/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'positive' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {trend === 'positive' ? '+2.5%' : '-1.2%'}
                    </span>
                )}
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <div className="text-2xl font-bold text-white">{value}</div>
            {subtext && <div className="text-xs text-slate-500 mt-2">{subtext}</div>}
        </div>
    )
}
