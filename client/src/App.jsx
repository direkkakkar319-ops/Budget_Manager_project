import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthLayout from './layouts/AuthLayout'
import SalaryLayout from './layouts/SalaryLayout'
import EnterpriseLayout from './layouts/EnterpriseLayout'
import SelfEmployedLayout from './layouts/SelfEmployedLayout'
import Login from './pages/Login'
import Register from './pages/Register'

import SalaryDashboard from './pages/salary/Dashboard'

import SalaryTransactions from './pages/salary/Transactions'
import SalaryBudgets from './pages/salary/Budgets'

import EnterpriseDashboard from './pages/enterprise/Dashboard'
import EnterpriseClients from './pages/enterprise/Clients'
import EnterpriseInvoices from './pages/enterprise/Invoices'
import EnterpriseReports from './pages/enterprise/Reports'

import SelfEmployedDashboard from './pages/self-employed/Dashboard'
import SelfEmployedBusiness from './pages/self-employed/Business'
import SelfEmployedFinances from './pages/self-employed/Finances'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/salary" element={
            <ProtectedRoute allowedRoles={['salary', 'admin']}>
              <SalaryLayout />
            </ProtectedRoute>
          }>
            <Route index element={<SalaryDashboard />} />
            <Route path="transactions" element={<SalaryTransactions />} />
            <Route path="budgets" element={<SalaryBudgets />} />
          </Route>

          <Route path="/enterprise" element={
            <ProtectedRoute allowedRoles={['client_mgmt', 'admin']}>
              <EnterpriseLayout />
            </ProtectedRoute>
          }>
            <Route index element={<EnterpriseDashboard />} />
            <Route path="clients" element={<EnterpriseClients />} />
            <Route path="invoices" element={<EnterpriseInvoices />} />
            <Route path="reports" element={<EnterpriseReports />} />
          </Route>

          <Route path="/self-employed" element={
            <ProtectedRoute allowedRoles={['self_employed', 'admin']}>
              <SelfEmployedLayout />
            </ProtectedRoute>
          }>
            <Route index element={<SelfEmployedDashboard />} />
            <Route path="clients" element={<SelfEmployedBusiness />} />
            <Route path="finances" element={<SelfEmployedFinances />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
