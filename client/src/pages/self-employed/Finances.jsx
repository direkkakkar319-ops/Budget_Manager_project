import { useState } from 'react'
import SalaryTransactions from '../salary/Transactions'
import SalaryBudgets from '../salary/Budgets'
import Tabs from '../../components/ui/Tabs'

export default function SelfEmployedFinances() {
    const [activeTab, setActiveTab] = useState('transactions')

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Personal Finances</h2>
                    <p className="text-slate-400">Track your spending and budgets</p>
                </div>
                <Tabs tabs={[{ label: 'Transactions', value: 'transactions' }, { label: 'Budgets', value: 'budgets' }]} initial={activeTab} onChange={setActiveTab} />
            </header>

            <div className="mt-6">
                {activeTab === 'transactions' ? <SalaryTransactions /> : <SalaryBudgets />}
            </div>
        </div>
    )
}
