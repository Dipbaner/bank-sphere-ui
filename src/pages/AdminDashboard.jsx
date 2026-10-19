import DashboardLayout from '../components/DashboardLayout'

const metrics = [
  { label: 'Active users', value: '24,180', detail: '+4.6% vs last month', tone: 'blue' },
  { label: 'Open accounts', value: '8,940', detail: 'Across all branches', tone: 'green' },
  { label: 'Monthly volume', value: '₹ 4.8 Cr', detail: 'Transaction value', tone: 'violet' },
  { label: 'Flagged risk', value: '07', detail: 'Needs review', tone: 'orange' },
]

const systemHealth = [
  { title: 'User administration', detail: 'Role changes and provisioning are on track', value: '98.4%' },
  { title: 'KYC workflow', detail: 'Verification backlog reduced this week', value: '6.2h' },
  { title: 'Transaction controls', detail: 'Daily limits and fraud checks are active', value: 'Online' },
]

const userDirectory = [
  ['USR-00841', 'Priya Sharma', 'Customer', 'priya.sharma@example.com', 'Active'],
  ['USR-00839', 'Arjun Patel', 'Customer', 'arjun.patel@example.com', 'Active'],
  ['USR-00028', 'Samira Khan', 'Employee', 'samira.khan@example.com', 'Active'],
  ['USR-00004', 'Dev Admin', 'Admin', 'dev.admin@example.com', 'Active'],
]

const accountOverview = [
  ['•••• 4821', 'Priya Sharma', 'Savings', '₹ 84,250.75', 'Active'],
  ['•••• 1906', 'Arjun Patel', 'Current', '₹ 1,26,800.00', 'Active'],
  ['•••• 3382', 'Rohan Das', 'Savings', '₹ 42,010.00', 'Frozen'],
  ['•••• 9014', 'Maya Roy', 'Current', '₹ 2,18,400.00', 'Active'],
]

const auditTrail = [
  ['10:42:18', 'TRANSFER_REVIEWED', 'Samira Khan', '10.24.8.16', 'Reviewed flagged transaction TXN-260618-084'],
  ['10:35:06', 'KYC_APPROVED', 'Dev Admin', '10.24.8.10', 'Approved customer verification CU-10468'],
  ['09:58:41', 'USER_SIGN_IN', 'Priya Sharma', '49.36.112.8', 'Successful sign-in with MFA'],
  ['09:42:03', 'ACCOUNT_FROZEN', 'Samira Khan', '10.24.8.16', 'Placed account ••3382 on temporary hold'],
]

const policyCards = [
  { title: 'Transfer limit', value: '₹ 5,00,000', detail: 'Maximum single transaction' },
  { title: 'Daily customer limit', value: '₹ 10,00,000', detail: 'Maximum outgoing per day' },
  { title: 'New beneficiary delay', value: '30 minutes', detail: 'Activation period before first transfer' },
]

function StatusPill({ value }) {
  const normalized = value.toLowerCase()
  const tone = normalized.includes('active') || normalized.includes('approved') || normalized.includes('completed') ? 'success'
    : normalized.includes('frozen') || normalized.includes('needs') || normalized.includes('pending') ? 'warning'
    : normalized.includes('review') ? 'info'
    : 'neutral'

  return <span className={`status-badge ${tone}`}>{value}</span>
}

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin dashboard">
      <div className="module-dashboard">
        <section className="module-overview-grid" aria-label="Admin summary metrics">
          {metrics.map((metric) => (
            <article className="module-metric-card" key={metric.label}>
              <div className="metric-top">
                <span className={`module-metric-icon ${metric.tone}`}>{metric.label.slice(0, 2).toUpperCase()}</span>
                <span className="metric-chip">Live</span>
              </div>
              <p className="module-metric-label">{metric.label}</p>
              <strong>{metric.value}</strong>
              <small>{metric.detail}</small>
            </article>
          ))}
        </section>

        <section className="module-panel">
          <div className="module-panel-header">
            <div>
              <p className="eyebrow">System health</p>
              <h3>Operational status</h3>
            </div>
            <button className="portal-button portal-button-primary">Generate report</button>
          </div>
          <div className="module-action-grid compact-grid">
            {systemHealth.map((item) => (
              <article className="module-action-card" key={item.title}>
                <strong>{item.value}</strong>
                <span>{item.title}</span>
                <small>{item.detail}</small>
              </article>
            ))}
          </div>
        </section>

        <div className="module-grid-two">
          <section className="module-panel">
            <div className="module-panel-header">
              <div>
                <p className="eyebrow">Users</p>
                <h3>User directory</h3>
              </div>
              <button className="portal-button portal-button-quiet">Add user</button>
            </div>
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Role</th><th>Email</th><th>Status</th></tr>
              </thead>
              <tbody>
                {userDirectory.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td><StatusPill value={row[4]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="module-panel">
            <div className="module-panel-header">
              <div>
                <p className="eyebrow">Accounts</p>
                <h3>Portfolio overview</h3>
              </div>
              <button className="portal-button portal-button-quiet">Review all</button>
            </div>
            <table>
              <thead>
                <tr><th>Account</th><th>Customer</th><th>Type</th><th>Balance</th><th>Status</th></tr>
              </thead>
              <tbody>
                {accountOverview.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td><StatusPill value={row[4]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <section className="module-panel">
          <div className="module-panel-header">
            <div>
              <p className="eyebrow">Risk and controls</p>
              <h3>System policies</h3>
            </div>
          </div>
          <div className="module-policy-grid">
            {policyCards.map((card) => (
              <article className="module-policy-card" key={card.title}>
                <span>{card.title}</span>
                <strong>{card.value}</strong>
                <small>{card.detail}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="module-panel">
          <div className="module-panel-header">
            <div>
              <p className="eyebrow">Audit trail</p>
              <h3>Recent activity</h3>
            </div>
            <button className="portal-button portal-button-quiet">Export logs</button>
          </div>
          <table>
            <thead>
              <tr><th>Time</th><th>Event</th><th>Actor</th><th>IP</th><th>Details</th></tr>
            </thead>
            <tbody>
              {auditTrail.map((row) => (
                <tr key={`${row[0]}-${row[1]}`}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </DashboardLayout>
  )
}