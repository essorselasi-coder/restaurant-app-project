import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/layout.css'

const links = [
  { to: '/dashboard', label: 'Dashboard', roles: ['admin'] },
  { to: '/menu', label: 'Menu', roles: ['admin', 'waiter'] },
  { to: '/tables', label: 'Tables', roles: ['admin', 'waiter'] },
  { to: '/orders', label: 'Orders', roles: ['admin', 'waiter', 'kitchen'] },
  { to: '/payments', label: 'Payments', roles: ['admin', 'waiter'] },

]

function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const visibleLinks = links.filter((link) => link.roles.includes(user.role))

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Restaurant App</h2>

        <nav>
          {visibleLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>{user.name}</p>
          <span>{user.role}</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout