import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Alert from './Alert'

export default function DashboardLayout({ title, children }) {
  const { user, logout, logoutAll } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function signOut(everywhere) {
    await (everywhere ? logoutAll() : logout())
    navigate('/login', { replace: true, state: { notice: 'You have been signed out.' } })
  }

  return (
    <div className="dash">
      <header className="topbar">
        <strong>BankSphere</strong>
        <span className="muted">{user.email} <span className="badge">{user.role}</span></span>
        <nav>
          <Link to="/change-password">Change password</Link>
          <Link to="/authenticator" target="_blank">Authenticator</Link>
          <button className="link" onClick={() => signOut(false)}>Sign out</button>
          <button className="link" onClick={() => signOut(true)}>Sign out everywhere</button>
        </nav>
      </header>
      <main className="content">
        <Alert type="info">{location.state?.notice}</Alert>
        <h2>{title}</h2>
        {children}
      </main>
    </div>
  )
}