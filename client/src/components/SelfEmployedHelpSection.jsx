import { Info, Briefcase, Wallet, Calendar } from 'lucide-react'

export default function SelfEmployedHelpSection() {
    return (
        <div className="card mt-8">
            <div className="flex items-center gap-2 mb-4">
                <Info className="text-cyan-400" size={24} />
                <h3 className="text-xl font-bold text-white">Freelance Business Guide</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <HelpCard
                    icon={<Briefcase className="text-blue-400" size={20} />}
                    title="Track Invoices"
                    description="Manage client invoices and payments. Monitor outstanding balances."
                />
                <HelpCard
                    icon={<Wallet className="text-emerald-400" size={20} />}
                    title="Personal Finances"
                    description="Separate business and personal expenses. Track your net income."
                />
                <HelpCard
                    icon={<Calendar className="text-rose-400" size={20} />}
                    title="Budget Planning"
                    description="Set monthly budgets for business and personal expenses."
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
