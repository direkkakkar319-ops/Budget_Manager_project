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
                    <h2 className="text-2xl font-bold text-white">Business Management</h2>
                    <p className="text-slate-400">Manage your clients and billing</p>
                </div>
                <Tabs tabs={[{ label: 'Invoices', value: 'invoices' }, { label: 'Clients', value: 'clients' }]} initial={activeTab} onChange={setActiveTab} />
            </header>

            <div className="mt-6">
                {activeTab === 'invoices' ? <EnterpriseInvoices /> : <EnterpriseClients />}
            </div>
        </div>
    )
}
