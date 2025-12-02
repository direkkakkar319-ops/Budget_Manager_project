import { useState } from 'react'
import EnterpriseClients from '../enterprise/Clients'
import EnterpriseInvoices from '../enterprise/Invoices'
import Tabs from '../../components/ui/Tabs'

export default function SelfEmployedBusiness() {
    const [activeTab, setActiveTab] = useState('invoices')

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-stone-800">Business Management</h2>
                    <p className="text-stone-500">Manage your clients and billing</p>
                </div>
                <Tabs tabs={[{ label: 'Invoices', value: 'invoices' }, { label: 'Clients', value: 'clients' }]} initial={activeTab} onChange={setActiveTab} />
            </header>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                {activeTab === 'invoices' ? <EnterpriseInvoices /> : <EnterpriseClients />}
            </div>
        </div>
    )
}
