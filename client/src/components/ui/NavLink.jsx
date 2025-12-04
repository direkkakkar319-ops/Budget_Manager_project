import { Link, useLocation } from 'react-router-dom'
import './NavLink.css'

export default function NavLink({ to, icon, label, activeClass, className }) {
  const location = useLocation()
  const isActive = location.pathname === to
  const base = className || 'ui-navlink'
  const active = activeClass || 'ui-navlink--active'
  const inactive = 'ui-navlink--inactive'
  return (
    <Link to={to} className={`${base} ${isActive ? active : inactive}`}>
      {icon}
      <span>{label}</span>
    </Link>
  )
}