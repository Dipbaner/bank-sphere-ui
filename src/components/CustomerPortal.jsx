import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useCustomerBanking, useCustomerPath } from '../customer/useCustomerBanking'

export default function CustomerPortal({ demoMode = false, basePath = '/customer' }) {
  const { user, logout, logoutAll } = useAuth()
  const { accounts } = useCustomerBanking()
  const navigate = useNavigate()
  const location = useLocation()
  const customerPath = useCustomerPath()
  const navigation = [
    { to: customerPath('/'), label: 'Overview', icon: 'OV', end: true },
    { to: customerPath('/profile'), label: 'Profile & security', icon: 'PS' },
    { to: customerPath('/accounts'), label: 'My accounts', icon: 'AC' },
    { to: customerPath('/transfer'), label: 'Transfer money', icon: 'TR' },
    { to: customerPath('/beneficiaries'), label: 'Beneficiaries', icon: 'BE' },
    { to: customerPath('/transactions'), label: 'Transactions', icon: 'TX' },
    { to: customerPath('/statements'), label: 'Statements', icon: 'ST' },
    { to: customerPath('/notifications'), label: 'Notifications', icon: 'NO' },
  ]
  const activeLink = navigation.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )
  const displayName = user?.email?.split('@')[0]?.replace(/[._-]/g, ' ') || (demoMode ? 'Alex Morgan' : 'Customer')
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

  async function signOut(everywhere) {
    await (everywhere ? logoutAll() : logout())
    navigate('/login', { replace: true, state: { notice: 'You have been signed out.' } })
  }

  return (
    <div className="portal">
      <aside className="portal-sidebar">
        <NavLink className="portal-brand" to={demoMode ? '/preview' : basePath} aria-label="BankSphere home">
          <span className="portal-brand-mark">B</span>
          <span>Bank<span>Sphere</span></span>
        </NavLink>
        <div className="portal-nav-label">YOUR BANK</div>
        <nav className="portal-nav" aria-label="Customer navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `portal-nav-link${isActive ? ' active' : ''}`}
            >
              <span className="portal-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="portal-sidebar-bottom">
          <div className="portal-help-card">
            <span className="portal-help-dot" />
            <div><strong>Need a hand?</strong><span>We’re here for you</span></div>
            <a href="mailto:support@banksphere.example" aria-label="Email BankSphere support">↗</a>
          </div>
          {demoMode && <NavLink className="portal-preview-link" to="/preview">← Switch demo portal</NavLink>}
          {!demoMode && <>
            <div className="portal-user">
              <div className="portal-avatar">{initials}</div>
              <div className="portal-user-info"><strong>{displayName}</strong><span>Customer account</span></div>
              <button className="portal-more" onClick={() => signOut(false)} aria-label="Sign out" title="Sign out">···</button>
            </div>
            <button className="portal-logout-all" onClick={() => signOut(true)}>Sign out everywhere</button>
          </>}
        </div>
      </aside>

      <div className="portal-main">
        <header className="portal-topbar">
          <div className="portal-breadcrumb">BankSphere <span>/</span> {activeLink?.label || 'Overview'}</div>
          <div className="portal-topbar-right">
            <span className="portal-demo-badge"><span /> Demo environment</span>
            {demoMode && <NavLink className="portal-topbar-link portal-preview-switch" to="/preview">All portals</NavLink>}
            {!demoMode && <NavLink className="portal-topbar-link" to="/change-password">Security</NavLink>}
            {!demoMode && <NavLink className="portal-topbar-link" to="/authenticator" target="_blank">Authenticator</NavLink>}
            <div className="portal-topbar-avatar" title={user?.email || 'Demo customer'}>{initials}</div>
          </div>
        </header>
        <main className="portal-content">
          <div className="portal-demo-notice">
            <strong>Demo data</strong>
            <span>Balances and activity are sample data. Transfers update this browser session only; no real money moves.</span>
            <span className="portal-demo-account-count">{accounts.length} accounts</span>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
