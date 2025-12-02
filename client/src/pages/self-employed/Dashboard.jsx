import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Wallet, Briefcase, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function SelfEmployedDashboard() {
    const { user } = useAuth()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

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
            <header>
                <h2 className="text-3xl font-serif font-bold text-stone-800">Overview</h2>
                <p className="text-stone-500">Your freelance business at a glance</p>
            </header>

            {/* Hybrid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Personal Balance"
                    value={`₹${data.balance.toLocaleString()}`}
                    icon={<Wallet className="text-amber-600" />}
                    bg="bg-amber-50"
                />
                <StatCard
                    title="Business Cashflow (30d)"
                    value={`₹${data.cashflow_30d.toLocaleString()}`}
                    icon={<Briefcase className="text-stone-600" />}
                    bg="bg-stone-100"
                />
                <StatCard
                    title="Net Income (90d)"
                    value={`₹${data.cashflow_90d.toLocaleString()}`}
                    icon={<ArrowUpRight className="text-emerald-600" />}
                    bg="bg-emerald-50"
                />
                <StatCard
                    title="Pending Invoices"
                    value="₹12,500"
                    icon={<ArrowDownRight className="text-rose-600" />}
                    bg="bg-rose-50"
                    subtext="3 invoices overdue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions / Recent Activity */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                    <h3 className="text-lg font-bold text-stone-800 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {/* Mock Activity */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                                        {i % 2 === 0 ? <Wallet size={18} /> : <Briefcase size={18} />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-stone-800">{i % 2 === 0 ? 'Grocery Shopping' : 'Client Payment Received'}</div>
                                        <div className="text-xs text-stone-500">Today, 10:23 AM</div>
                                    </div>
                                </div>
                                <div className={`font-bold ${i % 2 === 0 ? 'text-stone-800' : 'text-emerald-600'}`}>
                                    {i % 2 === 0 ? '-₹2,400' : '+₹15,000'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mini Budget Tracker */}
                <div className="bg-stone-900 text-stone-300 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Budget Status</h3>
                    <div className="space-y-6">
                        {data.budgets.slice(0, 3).map((b, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-300 capitalize">{b.category_id}</span>
                                    <span className="text-amber-500">₹{b.used} / ₹{b.target}</span>
                                </div>
                                <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500 rounded-full"
                                        style={{ width: `${Math.min(b.progress, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {data.budgets.length === 0 && <p className="text-stone-500 text-sm">No active budgets.</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, bg, subtext }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${bg}`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-stone-500 text-sm font-medium mb-1">{title}</h3>
            <div className="text-2xl font-bold text-stone-800">{value}</div>
            {subtext && <div className="text-xs text-stone-400 mt-2">{subtext}</div>}
        </div>
    )
}
