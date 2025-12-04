import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { Plus, FileText, Download, Trash2, Eye } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { generateInvoicePDF } from '../../utils/pdfGenerator'
import PDFPreviewModal from '../../components/PDFPreviewModal'

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

    const [previewUrl, setPreviewUrl] = useState(null)
    const [showPreview, setShowPreview] = useState(false)

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

    const handlePreview = async (invoice) => {
        try {
            const pdfBytes = await generateInvoicePDF(invoice)
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            setPreviewUrl(url)
            setShowPreview(true)
        } catch (err) {
            console.error('Error generating PDF:', err)
            alert('Failed to generate PDF preview')
        }
    }

    const handleDownload = async (invoice) => {
        try {
            const pdfBytes = await generateInvoicePDF(invoice)
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `Invoice-${invoice.invoice_number}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Error downloading PDF:', err)
            alert('Failed to download PDF')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Invoices</h2>
                <Button variant="primary" size="lg" onClick={openCreateModal} className="px-8 py-3 text-lg shadow-lg hover:shadow-cyan-500/20">
                    <Plus size={24} />
                    Add Invoice
                </Button>
            </div>

            {/* Invoices List */}
            <div className="card overflow-hidden p-0">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-400 text-xs uppercase font-semibold">
                        <tr>
                            <th className="p-4">Invoice #</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Amount</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {invoices.map(inv => (
                            <tr key={inv._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-white">{inv.invoice_number}</td>
                                <td className="p-4 text-slate-300">{inv.client_id?.name || 'Unknown'}</td>
                                <td className="p-4 text-slate-300">{new Date(inv.issue_date).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${inv.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' :
                                            inv.status === 'overdue' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right font-bold text-white">₹{inv.total.toLocaleString()}</td>
                                <td className="p-4 text-center">
                                    <Button variant="accent" size="sm" onClick={() => handleDownload(inv)}>
                                        <Download size={16} />
                                        Download
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handlePreview(inv)}>
                                        <Eye size={16} />
                                    </Button>
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
                            <label className="block text-sm font-medium text-slate-300 mb-2">Client</label>
                            <select
                                value={formData.client_id}
                                onChange={e => setFormData({ ...formData, client_id: e.target.value })}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all hover:border-white/20"
                                required
                            >
                                <option value="" className="bg-slate-800">Select Client</option>
                                {clients.map(c => <option key={c._id} value={c._id} className="bg-slate-800">{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Invoice Number</label>
                            <input
                                type="text"
                                value={formData.invoice_number}
                                onChange={e => setFormData({ ...formData, invoice_number: e.target.value })}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all hover:border-white/20"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Issue Date</label>
                            <input
                                type="date"
                                value={formData.issue_date}
                                onChange={e => setFormData({ ...formData, issue_date: e.target.value })}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all hover:border-white/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
                            <input
                                type="date"
                                value={formData.due_date}
                                onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all hover:border-white/20"
                            />
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium text-white">Items</h4>
                            <Button type="button" onClick={handleAddItem} variant="accent" size="sm">
                                <Plus size={16} />
                                Add Item
                            </Button>
                        </div>
                        {formData.items.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-2 items-end bg-slate-800/50 p-3 rounded-lg border border-white/10">
                                <div className="col-span-5">
                                    <label className="text-xs text-slate-400">Description</label>
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={e => handleItemChange(idx, 'description', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-400">Qty</label>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                        required
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label className="text-xs text-slate-400">Rate</label>
                                    <input
                                        type="number"
                                        value={item.rate}
                                        onChange={e => handleItemChange(idx, 'rate', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-400">Tax %</label>
                                    <input
                                        type="number"
                                        value={item.tax_rate}
                                        onChange={e => handleItemChange(idx, 'tax_rate', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
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

            <PDFPreviewModal
                open={showPreview}
                onClose={() => setShowPreview(false)}
                pdfUrl={previewUrl}
            />
        </div >
    )
}
