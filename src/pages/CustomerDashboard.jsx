import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../auth/AuthContext'

export default function CustomerDashboard() {
  const { user } = useAuth()
  return (
    <DashboardLayout title="Customer dashboard">
      <p>Welcome, {user.email}. You are fully signed in with two-factor authentication.</p>
      <p className="muted">Accounts, transfers and statements arrive with the next modules.</p>
    </DashboardLayout>
  )
}