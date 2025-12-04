import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Briefcase, Wallet, LogOut } from 'lucide-react'
import Footer from '../components/Footer'
import './SelfEmployedLayout.css'

export default function SelfEmployedLayout() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div data-theme="self" className="self-layout">
            <aside className="self-sidebar">
                <div className="self-sidebar-header">
                    <h1 className="self-brand">Freelance<span className="self-brand-highlight">Pro</span></h1>
                </div>

                <nav className="self-nav">
                    <div className="self-section-label">Overview</div>
                    <NavLink to="/self-employed" icon={<LayoutDashboard size={18} />} label="Dashboard" />

                    <div className="self-section-label self-section-spaced">Business</div>
                    <NavLink to="/self-employed/clients" icon={<Briefcase size={18} />} label="Clients & Invoices" />

                    <div className="self-section-label self-section-spaced">Personal</div>
                    <NavLink to="/self-employed/finances" icon={<Wallet size={18} />} label="My Finances" />
                </nav>

                <button onClick={handleLogout} className="self-logout-button">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            <main className="self-main">
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
            className={isActive ? 'self-link self-link-active' : 'self-link self-link-inactive'}
        >
            {icon}
            <span>{label}</span>
        </Link>
    )
}
