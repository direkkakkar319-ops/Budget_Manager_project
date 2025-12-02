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
                    <h2 className="text-2xl font-serif font-bold text-stone-800">Personal Finances</h2>
                    <p className="text-stone-500">Track your spending and budgets</p>
                </div>
                <Tabs tabs={[{ label: 'Transactions', value: 'transactions' }, { label: 'Budgets', value: 'budgets' }]} initial={activeTab} onChange={setActiveTab} />
            </header>

            <div className="bg-stone-900 p-6 rounded-xl shadow-lg min-h-[600px]">
                {activeTab === 'transactions' ? <SalaryTransactions /> : <SalaryBudgets />}
            </div>
        </div>
    )
}
