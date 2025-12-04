import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Receipt, PiggyBank, LogOut } from 'lucide-react'
import Footer from '../components/Footer'
import './SalaryLayout.css'

export default function SalaryLayout() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div data-theme="salary" className="salary-layout">
            <aside className="salary-sidebar">
                <div className="salary-brand">
                    <div className="salary-brand-icon" />
                    <h1 className="salary-brand-title">
                        Budget<span className="salary-brand-title-highlight">Flow</span>
                    </h1>
                </div>

                <nav className="salary-nav">
                    <NavLink to="/salary" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavLink to="/salary/transactions" icon={<Receipt size={20} />} label="Transactions" />
                    <NavLink to="/salary/budgets" icon={<PiggyBank size={20} />} label="Budgets" />
                </nav>

                <button onClick={handleLogout} className="btn-logout">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            <main className="salary-main">
                <Outlet />
                <Footer />
            </main>
        </div>
    )
}

function NavLink({ to, icon, label }) {
    const location = useLocation()
    const isActive = location.pathname === to

    return (
        <Link
            to={to}
            className={isActive ? 'salary-link salary-link-active' : 'salary-link salary-link-inactive'}
        >
            {icon}
            <span>{label}</span>
        </Link>
    )
}
