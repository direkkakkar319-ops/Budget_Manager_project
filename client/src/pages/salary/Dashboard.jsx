import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Skeleton } from '../../components/ui/Skeleton'
import { ArrowUpRight, ArrowDownRight, Wallet, Calendar, Download } from 'lucide-react'
import HelpSection from '../../components/HelpSection'
import ExportModal from '../../components/ExportModal'

const chartData = [
    { name: 'Monday', val: 400 },
    { name: 'Tuesday', val: 300 },
    { name: 'Wednesday', val: 600 },
    { name: 'Thursday', val: 200 },
    { name: 'Friday', val: 500 },
    { name: 'Saturday', val: 400 },
    { name: 'Sunday', val: 700 }
];

const COLORS = ['#06b6d4', '#3b82f6', '#06b6d4', '#3b82f6', '#06b6d4', '#3b82f6', '#06b6d4'];

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
                {payload.name.substring(0, 3)}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10} // Scale up
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                style={{ filter: 'drop-shadow(0px 0px 8px rgba(255,255,255,0.3))' }} // Glow effect
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
        </g>
    );
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const total = chartData.reduce((acc, curr) => acc + curr.val, 0);
        const percentage = ((data.val / total) * 100).toFixed(1);

        return (
            <div className="bg-slate-900 border border-white/10 rounded-lg p-3 shadow-xl">
                <p className="text-white font-bold mb-1">{data.name}</p>
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-400">Value:</span>
                    <span className="text-emerald-400 font-mono">₹{data.val}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-400">Share:</span>
                    <span className="text-blue-400 font-mono">{percentage}%</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function SalaryDashboard() {
    const { user } = useAuth()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeIndex, setActiveIndex] = useState(0)
    const [showExport, setShowExport] = useState(false)

    const onPieEnter = (_, index) => {
        setActiveIndex(index)
    }

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
            <div className="dashboard-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="card">
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
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-gradient font-extrabold tracking-tight text-3xl md:text-4xl lg:text-5xl">Welcome back, Salary Person</h2>
                    <p className="text-slate-400 mt-1">Here's your financial overview</p>
                </div>
                <div className="flex items-center gap-3 pr-3">
                    <button
                        onClick={() => setShowExport(true)}
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-white/10"
                    >
                        <Download size={18} />
                        Export Data
                    </button>
                    <div className="hidden md:flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-300">30d ₹{data.cashflow_30d.toLocaleString()}</span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-300">Bills {data.upcoming_bills}</span>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="dashboard-grid">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-stretch">
                {/* Budget Progress */}
                <div className="card flex flex-col min-h-[280px]">
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
                <div className="card flex flex-col min-h-[280px]">
                    <h3 className="text-xl font-bold text-white mb-4">Cashflow Distribution</h3>
                    <div className="flex-1 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="val"
                                    onMouseEnter={onPieEnter}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <HelpSection />

            {/* Export Modal */}
            <ExportModal open={showExport} onClose={() => setShowExport(false)} />
        </div>
    )
}

function StatCard({ title, value, icon, subtext, trend }) {
    return (
        <div className="card transition-colors group">
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
