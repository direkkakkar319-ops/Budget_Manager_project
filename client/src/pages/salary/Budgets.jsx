import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { Plus, Trash2 } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

export default function SalaryBudgets() {
    const { user } = useAuth()
    const [budgets, setBudgets] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        category_id: 'food',
        target: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        notes: ''
    })

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/budgets', {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
                setBudgets(res.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchBudgets()
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:3001/api/budgets', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setShowModal(false)
            const res = await axios.get('http://localhost:3001/api/budgets', {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setBudgets(res.data)
            setFormData({ ...formData, target: '', notes: '' })
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Budgets</h2>
                <Button variant="primary" size="lg" onClick={() => setShowModal(true)} className="px-8 py-3 text-lg shadow-lg hover:shadow-cyan-500/20">
                    <Plus size={24} />
                    Add Budget
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map(b => (
                    <div key={b._id} className="card">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white capitalize">{b.category_id}</h3>
                                <p className="text-xs text-slate-400">{new Date(b.start_date).toLocaleDateString()} - {new Date(b.end_date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-2xl font-bold text-cyan-400">₹{b.target}</div>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">{b.notes || 'No notes'}</p>
                    </div>
                ))}
                {budgets.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        No budgets found. Create one to start tracking.
                    </div>
                )}
            </div>

            {/* Add Modal */}
            <Modal open={showModal} onClose={() => setShowModal(false)} title="Set Budget" dark>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            <option value="shopping">Shopping</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Target Amount</label>
                        <input
                            type="number"
                            value={formData.target}
                            onChange={e => setFormData({ ...formData, target: e.target.value })}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg p-2 text-white"
                            placeholder="0.00"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg p-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">End Date</label>
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg p-2 text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Notes</label>
                        <input
                            type="text"
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg p-2 text-white"
                            placeholder="Optional..."
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
