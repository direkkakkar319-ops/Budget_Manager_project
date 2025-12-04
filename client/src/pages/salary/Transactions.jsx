import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { Plus, Search, Filter, Trash2, X, Check, Calendar, AlertTriangle } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

export default function SalaryTransactions() {
    const { user } = useAuth()
    const [transactions, setTransactions] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // Filter State
    const [searchQuery, setSearchQuery] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState(() => {
        const saved = localStorage.getItem('salary_filters')
        return saved ? JSON.parse(saved) : {
            categories: [],
            startDate: '',
            endDate: ''
        }
    })

    useEffect(() => {
        localStorage.setItem('salary_filters', JSON.stringify(filters))
    }, [filters])

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        type: 'expense',
        category_id: 'food',
        notes: ''
    })

    const CATEGORIES = ['food', 'salary', 'utilities', 'transport', 'entertainment', 'other_income']

    const fetchTransactions = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (searchQuery) params.append('q', searchQuery)
            if (filters.categories.length) params.append('category_id', filters.categories.join(','))
            if (filters.startDate) params.append('from', filters.startDate)
            if (filters.endDate) params.append('to', filters.endDate)

            const res = await axios.get(`http://localhost:3001/api/transactions?${params.toString()}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setTransactions(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTransactions()
        }, 300)
        return () => clearTimeout(timer)
    }, [user, searchQuery, filters])

    const toggleCategory = (cat) => {
        setFilters(prev => {
            const exists = prev.categories.includes(cat)
            return {
                ...prev,
                categories: exists
                    ? prev.categories.filter(c => c !== cat)
                    : [...prev.categories, cat]
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:3001/api/transactions', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setShowModal(false)
            setShowModal(false)
            fetchTransactions()
            setFormData({ ...formData, amount: '', notes: '' })
            setFormData({ ...formData, amount: '', notes: '' })
        } catch (err) {
            console.error(err)
        }
    }

    const confirmDelete = async () => {
        if (!deleteId) return
        console.log('Deleting transaction:', deleteId)
        setIsLoading(true)
        try {
            await axios.delete(`http://localhost:3001/api/transactions/${deleteId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            console.log('Delete successful')
            setDeleteId(null)
            // Force refresh with timestamp to avoid cache
            const params = new URLSearchParams()
            if (searchQuery) params.append('q', searchQuery)
            if (filters.categories.length) params.append('category_id', filters.categories.join(','))
            if (filters.startDate) params.append('from', filters.startDate)
            if (filters.endDate) params.append('to', filters.endDate)
            params.append('_t', Date.now())

            const res = await axios.get(`http://localhost:3001/api/transactions?${params.toString()}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setTransactions(res.data)
        } catch (err) {
            console.error('Delete failed:', err)
            const msg = err.response?.data?.error || err.message || 'Unknown error'
            alert(`Failed to delete transaction: ${msg}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Transactions</h2>
                <Button variant="accent" onClick={() => setShowModal(true)}>
                    <Plus size={20} />
                    Add New
                </Button>
            </div>

            {/* Filters & Search */}
            <div className="flex gap-4 mb-6 relative z-10">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search transactions..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowFilters(true)}
                        className={`p-2 border rounded-xl transition-colors ${showFilters ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-white'}`}
                    >
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Filter Modal */}
            <Modal open={showFilters} onClose={() => setShowFilters(false)} title="Filter Transactions" dark>
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Categories</label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => toggleCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${filters.categories.includes(cat)
                                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                        : 'bg-slate-800 border-white/10 text-slate-400 hover:border-white/30'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Date Range</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-xs text-slate-500 mb-1">From</label>
                                <input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-xs text-slate-500 mb-1">To</label>
                                <input
                                    type="date"
                                    value={filters.endDate}
                                    min={filters.startDate}
                                    onChange={e => setFilters({ ...filters, endDate: e.target.value })}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <Button
                            onClick={() => setFilters({ categories: [], startDate: '', endDate: '' })}
                            variant="secondary"
                            className="flex-1"
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={() => setShowFilters(false)}
                            variant="accent"
                            className="flex-1"
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Transactions List */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-slate-300">
                    <thead className="bg-white/5 text-slate-400 uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Note</th>
                            <th className="p-4 text-right">Amount</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {transactions.map(t => (
                            <tr key={t._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="p-4 capitalize">
                                    <span className="px-2 py-1 rounded-full bg-white/5 text-xs border border-white/10">
                                        {t.category_id}
                                    </span>
                                </td>
                                <td className="p-4">{t.notes}</td>
                                <td className={`p-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                    {t.type === 'income' ? '+' : '-'}₹{t.amount}
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => setDeleteId(t._id)}
                                        className="p-2 bg-slate-900/50 border border-white/10 rounded-xl text-slate-400 hover:bg-rose-500 hover:border-rose-500 hover:text-white transition-all group"
                                        title="Delete Transaction"
                                    >
                                        <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-500">
                                    {isLoading ? 'Loading...' : 'No transactions found matching your filters'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Transaction" dark>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg p-2 text-white"
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg p-2 text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Amount</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg p-2 text-white"
                            placeholder="0.00"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Category</label>
                        <select
                            value={formData.category_id}
                            onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg p-2 text-white"
                        >
                            <option value="food">Food</option>
                            <option value="transport">Transport</option>
                            <option value="utilities">Utilities</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="salary">Salary</option>
                            <option value="other_income">Other Income</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Notes</label>
                        <input
                            type="text"
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg p-2 text-white"
                            placeholder="Description..."
                        />
                    </div>
                    <div className="flex gap-3 mt-6">
                        <Button type="button" onClick={() => setShowModal(false)} variant="secondary" className="flex-1">Cancel</Button>
                        <Button type="submit" variant="accent" className="flex-1">Save</Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Transaction" dark>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-rose-400 bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
                        <AlertTriangle size={24} />
                        <p className="text-sm">Are you sure you want to delete this transaction? This action cannot be undone.</p>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <Button type="button" onClick={() => { console.log('Cancel delete'); setDeleteId(null) }} variant="secondary" className="flex-1">Cancel</Button>
                        <Button type="button" onClick={confirmDelete} disabled={isLoading} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white">
                            {isLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div >
    )
}
