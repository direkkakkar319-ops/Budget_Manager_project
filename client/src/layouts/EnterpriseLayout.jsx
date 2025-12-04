import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Users, FileText, BarChart3, LogOut } from 'lucide-react'
import Footer from '../components/Footer'
import './EnterpriseLayout.css'

export default function EnterpriseLayout() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div data-theme="enterprise" className="enterprise-layout">
            <header className="enterprise-header">
                <div className="enterprise-header-inner">
                    <div className="enterprise-branding">
                        <div className="enterprise-brand-icon">E</div>
                        <span className="enterprise-brand-title">Enterprise</span>
                    </div>
                    <nav className="enterprise-nav">
                        <NavLink to="/enterprise" icon={<LayoutDashboard size={18} />} label="Overview" />
                        <NavLink to="/enterprise/clients" icon={<Users size={18} />} label="Clients" />
                        <NavLink to="/enterprise/invoices" icon={<FileText size={18} />} label="Invoices" />
                        <NavLink to="/enterprise/reports" icon={<BarChart3 size={18} />} label="Reports" />
                    </nav>
                    <button onClick={handleLogout} className="enterprise-logout">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            <main className="enterprise-main">
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
            className={isActive ? 'enterprise-link enterprise-link-active' : 'enterprise-link enterprise-link-inactive'}
        >
            {icon}
            <span>{label}</span>
        </Link>
    )
}
