import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { formatDate, formatMoney } from '../customer/customerUtils'
import { useCustomerBanking, useCustomerPath } from '../customer/useCustomerBanking'
import { useLocation } from 'react-router-dom'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const { accounts, transactions } = useCustomerBanking()
  const customerPath = useCustomerPath()
  const location = useLocation()
  const quickActions = [
    { to: customerPath('/transfer'), title: 'Send money', detail: 'Make a bank transfer', icon: '↗', tone: 'blue' },
    { to: customerPath('/accounts'), title: 'Your accounts', detail: 'View balances & details', icon: '▤', tone: 'violet' },
    { to: customerPath('/statements'), title: 'Get a statement', detail: 'Download account activity', icon: '↓', tone: 'green' },
  ]
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  const latestTransactions = transactions.slice(0, 5)
  const greetingName = user?.email?.split('@')[0]?.replace(/[._-]/g, ' ') || (location.pathname.startsWith('/preview/') ? 'Alex' : 'there')

  return (
    <div className="portal-page">
      <section className="portal-page-heading portal-welcome">
        <div>
          <p className="portal-eyebrow">PERSONAL BANKING · {formatDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1>Good day, {greetingName}</h1>
          <p className="portal-subtitle">Here’s what’s happening with your money.</p>
        </div>
        <Link className="portal-button portal-button-primary" to={customerPath('/transfer')}><span>↗</span> New transfer</Link>
      </section>

      <section className="portal-overview-grid" aria-label="Account overview">
        <article className="portal-balance-card">
          <div className="portal-balance-card-top">
            <div>
              <span className="portal-card-label">TOTAL BALANCE</span>
              <div className="portal-total-balance">{formatMoney(totalBalance)}</div>
              <span className="portal-balance-caption">Across {accounts.length} active accounts</span>
            </div>
            <div className="portal-balance-symbol">₹</div>
          </div>
          <div className="portal-balance-card-bottom">
            <div><span>Available balance</span><strong>{formatMoney(accounts.reduce((sum, account) => sum + account.available, 0))}</strong></div>
            <span className="portal-balance-period">Updated just now</span>
          </div>
          <div className="portal-balance-decoration portal-balance-decoration-one" />
          <div className="portal-balance-decoration portal-balance-decoration-two" />
        </article>

        <article className="portal-summary-card">
          <div className="portal-summary-icon portal-summary-icon-green">↓</div>
          <span className="portal-card-label">MONEY IN</span>
          <strong>{formatMoney(transactions.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0))}</strong>
          <span className="portal-summary-foot">From recent activity</span>
        </article>

        <article className="portal-summary-card">
          <div className="portal-summary-icon portal-summary-icon-orange">↑</div>
          <span className="portal-card-label">MONEY OUT</span>
          <strong>{formatMoney(Math.abs(transactions.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0)))}</strong>
          <span className="portal-summary-foot">From recent activity</span>
        </article>
      </section>

      <section className="portal-section">
        <div className="portal-section-heading">
          <div><h2>Quick actions</h2><p>Everyday banking, made simple.</p></div>
        </div>
        <div className="portal-action-grid">
          {quickActions.map((action) => (
            <Link className="portal-action-card" to={action.to} key={action.title}>
              <span className={`portal-action-icon ${action.tone}`}>{action.icon}</span>
              <span className="portal-action-copy"><strong>{action.title}</strong><small>{action.detail}</small></span>
              <span className="portal-action-arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="portal-section">
        <div className="portal-section-heading">
          <div><h2>Your accounts</h2><p>A quick look at your BankSphere accounts.</p></div>
          <Link className="portal-text-link" to={customerPath('/accounts')}>View all accounts <span>→</span></Link>
        </div>
        <div className="portal-account-grid">
          {accounts.map((account) => (
            <article className="portal-account-card" key={account.id}>
              <div className="portal-account-card-top">
                <div className={`portal-account-icon ${account.color}`}>▤</div>
                <span className="portal-status"><i /> {account.status}</span>
              </div>
              <span className="portal-account-type">{account.type} account</span>
              <strong className="portal-account-balance">{formatMoney(account.balance)}</strong>
              <div className="portal-account-card-bottom"><span>{account.name}</span><span>{account.number}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="portal-section portal-activity-section">
        <div className="portal-section-heading">
          <div><h2>Recent activity</h2><p>Your latest transactions across all accounts.</p></div>
          <Link className="portal-text-link" to={customerPath('/transactions')}>See all activity <span>→</span></Link>
        </div>
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead><tr><th>TRANSACTION</th><th>DATE</th><th>ACCOUNT</th><th>STATUS</th><th className="align-right">AMOUNT</th></tr></thead>
            <tbody>
              {latestTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td><div className="portal-transaction-name"><span className={`portal-transaction-icon ${transaction.amount > 0 ? 'income' : ''}`}>{transaction.amount > 0 ? '↓' : '↗'}</span><span><strong>{transaction.title}</strong><small>{transaction.category}</small></span></div></td>
                  <td>{formatDate(transaction.date, { day: 'numeric', month: 'short' })}</td>
                  <td>{transaction.account}</td>
                  <td><span className="portal-status"><i /> {transaction.status}</span></td>
                  <td className={`align-right portal-amount ${transaction.amount > 0 ? 'positive' : ''}`}>{transaction.amount > 0 ? '+' : '−'}{formatMoney(Math.abs(transaction.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
