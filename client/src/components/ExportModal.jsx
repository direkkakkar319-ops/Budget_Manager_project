import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { X, FileText, Table, Download, Loader2 } from 'lucide-react'
import Button from './ui/Button'
import Modal from './ui/Modal'

export default function ExportModal({ open, onClose }) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [format, setFormat] = useState('pdf')
    const [type, setType] = useState('transactions')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [includeSensitive, setIncludeSensitive] = useState(false)

    const handleExport = async () => {
        try {
            setLoading(true)
            const response = await axios.post('http://localhost:3001/api/export', {
                format,
                type,
                startDate,
                endDate,
                includeSensitive
            }, {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            })

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            const ext = format === 'pdf' ? 'pdf' : 'csv'
            link.setAttribute('download', `export-${type}-${new Date().toISOString().split('T')[0]}.${ext}`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            onClose()
        } catch (err) {
            console.error('Export failed:', err)
            alert('Failed to export data. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal open={open} onClose={onClose} title="Export Data">
            <div className="space-y-6">
                {/* Format Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Export Format</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setFormat('pdf')}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${format === 'pdf'
                                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                                    : 'bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-800'
                                }`}
                        >
                            <FileText size={24} />
                            <span className="font-medium">PDF Document</span>
                        </button>
                        <button
                            onClick={() => setFormat('csv')}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${format === 'csv'
                                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                                    : 'bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-800'
                                }`}
                        >
                            <Table size={24} />
                            <span className="font-medium">CSV Spreadsheet</span>
                        </button>
                    </div>
                </div>

                {/* Data Type */}
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Data Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    >
                        <option value="transactions">Transactions</option>
                        <option value="budgets">Budgets</option>
                    </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                </div>

                {/* Options */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="sensitive"
                        checked={includeSensitive}
                        onChange={(e) => setIncludeSensitive(e.target.checked)}
                        className="w-4 h-4 rounded border-white/10 bg-slate-800/50 text-cyan-500 focus:ring-cyan-500"
                    />
                    <label htmlFor="sensitive" className="text-sm text-slate-300">
                        Include sensitive information (Notes, Vendor details)
                    </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button variant="secondary" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleExport} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin mr-2" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download size={18} className="mr-2" />
                                Download {format.toUpperCase()}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
