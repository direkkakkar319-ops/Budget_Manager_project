import { Info, Users, FileText, TrendingUp } from 'lucide-react'

export default function EnterpriseHelpSection() {
    return (
        <div className="card mt-8">
            <div className="flex items-center gap-2 mb-4">
                <Info className="text-cyan-400" size={24} />
                <h3 className="text-xl font-bold text-white">Business Management Guide</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <HelpCard
                    icon={<Users className="text-emerald-400" size={20} />}
                    title="Manage Clients"
                    description="Add and track your client base. View client details and transaction history."
                />
                <HelpCard
                    icon={<FileText className="text-blue-400" size={20} />}
                    title="Create Invoices"
                    description="Generate professional invoices. Track payment status and send reminders."
                />
                <HelpCard
                    icon={<TrendingUp className="text-cyan-400" size={20} />}
                    title="Monitor Revenue"
                    description="Analyze revenue trends and expenses. View monthly performance reports."
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
