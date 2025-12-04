export default function EnterpriseCard({ title, value, icon, trend, subtext, className = '' }) {
    return (
        <div className={`card transition-colors group ${className}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                {trend && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <div className="text-2xl font-bold text-white">{value}</div>
            {subtext && <div className="text-xs text-slate-500 mt-2">{subtext}</div>}
        </div>
    )
}
