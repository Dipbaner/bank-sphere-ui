import DashboardLayout from '../components/DashboardLayout'

const metrics = [
  { label: 'Customers', value: '18,420', detail: '+3.2% this month', tone: 'blue' },
  { label: 'KYC review', value: '08', detail: 'Awaiting action', tone: 'violet' },
  { label: 'Flagged transfers', value: '03', detail: 'Requires review', tone: 'orange' },
  { label: 'Open requests', value: '05', detail: 'Across service queues', tone: 'green' },
]

const quickActions = [
  { title: 'Customer directory', detail: 'Search and review customer profiles', icon: 'CU' },
  { title: 'KYC verification', detail: 'Approve identity and address checks', icon: 'KY' },
  { title: 'Transaction monitoring', detail: 'Flagged activity and risk review', icon: 'TX' },
  { title: 'Service requests', detail: 'Address account and profile requests', icon: 'SR' },
]

const customerQueue = [
  ['CU-10482', 'Priya Sharma', 'Savings account', 'KYC pending', 'Review'],
  ['CU-10479', 'Arjun Patel', 'Current account', 'Active', 'View'],
  ['CU-10476', 'Neha Iyer', 'Address update', 'Pending', 'Review'],
  ['CU-10471', 'Karan Singh', 'Current account', 'Active', 'View'],
]

const verificationQueue = [
  ['Priya Sharma', 'Identity verification', 'Today, 10:18 AM', '3 files', 'Review'],
  ['Devika Nair', 'Savings account opening', 'Today, 09:42 AM', '4 files', 'Review'],
  ['Rohan Das', 'Address verification', 'Yesterday, 04:30 PM', '2 files', 'Review'],
  ['Maya Roy', 'Identity verification', 'Yesterday, 02:12 PM', '3 files', 'Review'],
]

const flaggedTransactions = [
  ['TXN-260618-084', 'Large transfer', 'Customer ••4821', '₹ 2,50,000.00', 'Needs review'],
  ['TXN-260618-079', 'Repeated transfers', 'Customer ••1029', '₹ 48,500.00', 'Investigating'],
  ['TXN-260617-221', 'Unusual activity', 'Customer ••7746', '₹ 1,15,000.00', 'Needs review'],
]

function StatusPill({ value }) {
  const normalized = value.toLowerCase()
  const tone = normalized.includes('active') || normalized.includes('approved') || normalized.includes('completed') ? 'success'
    : normalized.includes('review') || normalized.includes('pending') || normalized.includes('needs') ? 'warning'
    : normalized.includes('investigating') ? 'info'
    : 'neutral'

  return <span className={`status-badge ${tone}`}>{value}</span>
}

export default function EmployeeDashboard() {
  return (
    <DashboardLayout title="Employee dashboard">
      <div className="module-dashboard">
        <section className="module-overview-grid" aria-label="Employee summary metrics">
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
              <p className="eyebrow">Operations</p>
              <h3>Daily workbench</h3>
            </div>
            <button className="portal-button portal-button-primary">Export queue</button>
          </div>
          <div className="module-action-grid">
            {quickActions.map((action) => (
              <article className="module-action-card" key={action.title}>
                <span className="module-action-icon">{action.icon}</span>
                <strong>{action.title}</strong>
                <small>{action.detail}</small>
              </article>
            ))}
          </div>
        </section>

        <div className="module-grid-two">
          <section className="module-panel">
            <div className="module-panel-header">
              <div>
                <p className="eyebrow">Customers</p>
                <h3>Customer queue</h3>
              </div>
              <button className="portal-button portal-button-quiet">View all</button>
            </div>
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Account</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {customerQueue.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td><StatusPill value={row[3]} /></td>
                    <td><button className="link">{row[4]}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="module-panel">
            <div className="module-panel-header">
              <div>
                <p className="eyebrow">Verification</p>
                <h3>Review queue</h3>
              </div>
              <span className="pill-count">8 in review</span>
            </div>
            <table>
              <thead>
                <tr><th>Customer</th><th>Submission</th><th>Received</th><th>Docs</th><th>Action</th></tr>
              </thead>
              <tbody>
                {verificationQueue.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td><button className="link">{row[4]}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <section className="module-panel">
          <div className="module-panel-header">
            <div>
              <p className="eyebrow">Monitoring</p>
              <h3>Flagged transactions</h3>
            </div>
            <span className="pill-count warning">3 need attention</span>
          </div>
          <table>
            <thead>
              <tr><th>Reference</th><th>Alert</th><th>Account</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {flaggedTransactions.map((row) => (
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
    </DashboardLayout>
  )
}