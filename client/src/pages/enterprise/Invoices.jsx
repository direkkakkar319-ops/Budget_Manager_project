import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { Plus, FileText, Download, Trash2 } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

export default function EnterpriseInvoices() {
    const { user } = useAuth()
    const [invoices, setInvoices] = useState([])
    const [clients, setClients] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        client_id: '',
        invoice_number: '',
        issue_date: '',
        due_date: '',
        items: [{ description: '', quantity: 1, rate: 0, tax_rate: 0 }]
    })

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/invoices', {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
                setInvoices(res.data)
            } catch (err) {
                console.error(err)
            }
        }
        const fetchClients = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/clients', {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
                setClients(res.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchInvoices()
        fetchClients()
    }, [user])

    const openCreateModal = () => {
        const now = Date.now()
        const today = new Date()
        const issue = today.toISOString().split('T')[0]
        const due = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        setFormData({
            client_id: '',
            invoice_number: `INV-${now}`,
            issue_date: issue,
            due_date: due,
            items: [{ description: '', quantity: 1, rate: 0, tax_rate: 0 }]
        })
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:3001/api/invoices', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setShowModal(false)
            const res = await axios.get('http://localhost:3001/api/invoices', {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setInvoices(res.data)
            setFormData({
                client_id: '',
                invoice_number: '',
                issue_date: '',
                due_date: '',
                items: [{ description: '', quantity: 1, rate: 0, tax_rate: 0 }]
            })
        } catch (err) {
            console.error(err)
        }
    }

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', quantity: 1, rate: 0, tax_rate: 0 }]
        })
    }

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items]
        newItems[index][field] = value
        setFormData({ ...formData, items: newItems })
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
                <Button onClick={openCreateModal}>
                    <Plus size={20} />
                    Create Invoice
                </Button>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="p-4">Invoice #</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Amount</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {invoices.map(inv => (
                            <tr key={inv._id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-900">{inv.invoice_number}</td>
                                <td className="p-4">{inv.client_id?.name || 'Unknown'}</td>
                                <td className="p-4">{new Date(inv.issue_date).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                            inv.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right font-bold">₹{inv.total.toLocaleString()}</td>
                                <td className="p-4 text-center flex justify-center gap-2">
                                    <button className="text-gray-400 hover:text-blue-600"><Download size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            <Modal open={showModal} onClose={() => setShowModal(false)} title="Create New Invoice">
                <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                                    <select
                                        value={formData.client_id}
                                        onChange={e => setFormData({ ...formData, client_id: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                        required
                                    >
                                        <option value="">Select Client</option>
                                        {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                                    <input
                                        type="text"
                                        value={formData.invoice_number}
                                        onChange={e => setFormData({ ...formData, invoice_number: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                                    <input
                                        type="date"
                                        value={formData.issue_date}
                                        onChange={e => setFormData({ ...formData, issue_date: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={formData.due_date}
                                        onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                    />
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium text-gray-900">Items</h4>
                                    <button type="button" onClick={handleAddItem} className="text-sm text-blue-600 hover:underline">+ Add Item</button>
                                </div>
                                {formData.items.map((item, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-2 items-end bg-gray-50 p-3 rounded-lg">
                                        <div className="col-span-5">
                                            <label className="text-xs text-gray-500">Description</label>
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={e => handleItemChange(idx, 'description', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-1 text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs text-gray-500">Qty</label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-1 text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label className="text-xs text-gray-500">Rate</label>
                                            <input
                                                type="number"
                                                value={item.rate}
                                                onChange={e => handleItemChange(idx, 'rate', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-1 text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs text-gray-500">Tax %</label>
                                            <input
                                                type="number"
                                                value={item.tax_rate}
                                                onChange={e => handleItemChange(idx, 'tax_rate', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-1 text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                    <div className="flex gap-3 mt-6 pt-6 border-t">
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" className="flex-1">Create Invoice</Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
