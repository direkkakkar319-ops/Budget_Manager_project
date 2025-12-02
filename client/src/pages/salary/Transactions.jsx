import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { Plus, Search, Filter, Trash2 } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

export default function SalaryTransactions() {
    const { user } = useAuth()
    const [transactions, setTransactions] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        type: 'expense',
        category_id: 'food',
        notes: ''
    })

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/transactions', {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
                setTransactions(res.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchTransactions()
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:3001/api/transactions', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setShowModal(false)
            const res = await axios.get('http://localhost:3001/api/transactions', {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setTransactions(res.data)
            setFormData({ ...formData, amount: '', notes: '' })
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return
        try {
            await axios.delete(`http://localhost:3001/api/transactions/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            const res = await axios.get('http://localhost:3001/api/transactions', {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setTransactions(res.data)
        } catch (err) {
            console.error(err)
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

            {/* Filters & Search (Mock) */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                </div>
                <button className="p-2 bg-slate-900/50 border border-white/10 rounded-xl text-slate-400 hover:text-white">
                    <Filter size={20} />
                </button>
            </div>

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
                                    <button onClick={() => handleDelete(t._id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-500">No transactions found</td>
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
        </div>
    )
}
