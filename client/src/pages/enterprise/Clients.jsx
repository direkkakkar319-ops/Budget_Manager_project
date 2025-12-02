import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { Plus, Search, Mail, Phone, MapPin, Trash2, Edit } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

export default function EnterpriseClients() {
    const { user } = useAuth()
    const [clients, setClients] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', gstin: '' })
    const [query, setQuery] = useState('')

    useEffect(() => {
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
        fetchClients()
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:3001/api/clients', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setShowModal(false)
            const res = await axios.get('http://localhost:3001/api/clients', {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setClients(res.data)
            setFormData({ name: '', email: '', phone: '', address: '', gstin: '' })
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete client?')) return
        try {
            await axios.delete(`http://localhost:3001/api/clients/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            const res = await axios.get('http://localhost:3001/api/clients', {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setClients(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input value={query} onChange={e => setQuery(e.target.value)} type="text" placeholder="Search clients..." className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <Button onClick={() => setShowModal(true)}>
                        <Plus size={20} />
                        Add Client
                    </Button>
                </div>
            </div>

            {/* Client Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.email?.toLowerCase().includes(query.toLowerCase())).map(client => (
                    <div key={client._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                                {client.name.charAt(0)}
                            </div>
                            <div className="flex gap-2">
                                <button className="text-gray-400 hover:text-blue-600"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(client._id)} className="text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1">{client.name}</h3>
                        {client.gstin && <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded inline-block mb-4">GSTIN: {client.gstin}</div>}

                        <div className="space-y-2 text-sm text-gray-600">
                            {client.email && (
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-gray-400" />
                                    {client.email}
                                </div>
                            )}
                            {client.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-gray-400" />
                                    {client.phone}
                                </div>
                            )}
                            {client.address && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400" />
                                    {client.address}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Client">
                <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
                                <input
                                    type="text"
                                    value={formData.gstin}
                                    onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                    <div className="flex gap-3 mt-6">
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" className="flex-1">Save Client</Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
