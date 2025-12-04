import { Info, TrendingUp, PiggyBank, Receipt } from 'lucide-react'

export default function HelpSection() {
    return (
        <div className="card mt-8">
            <div className="flex items-center gap-2 mb-4">
                <Info className="text-cyan-400" size={24} />
                <h3 className="text-xl font-bold text-white">Quick Start Guide</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <HelpCard
                    icon={<TrendingUp className="text-emerald-400" size={20} />}
                    title="Track Your Balance"
                    description="Monitor your total balance and cashflow trends in real-time. View 30-day and 90-day summaries."
                />
                <HelpCard
                    icon={<PiggyBank className="text-blue-400" size={20} />}
                    title="Set Budgets"
                    description="Create category budgets to control spending. Track progress with visual indicators."
                />
                <HelpCard
                    icon={<Receipt className="text-rose-400" size={20} />}
                    title="Log Transactions"
                    description="Record income and expenses. Categorize transactions for better insights."
                />
            </div>
        </div>
    )
}

function HelpCard({ icon, title, description }) {
    return (
        <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <h4 className="font-semibold text-white">{title}</h4>
            </div>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
    )
}
