import { Link } from 'react-router-dom'
import { formatDate, formatMoney } from '../customer/customerUtils'
import { useCustomerBanking, useCustomerPath } from '../customer/useCustomerBanking'

export default function CustomerAccounts() {
  const { accounts, transactions } = useCustomerBanking()
  const customerPath = useCustomerPath()
  const total = accounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="portal-page">
      <section className="portal-page-heading">
        <div><p className="portal-eyebrow">YOUR MONEY</p><h1>My accounts</h1><p className="portal-subtitle">View your account balances and details in one place.</p></div>
        <Link className="portal-button portal-button-primary" to={customerPath('/transfer')}><span>↗</span> Transfer money</Link>
      </section>
      <div className="portal-page-stat"><span>Total across {accounts.length} accounts</span><strong>{formatMoney(total)}</strong></div>
      <div className="portal-account-list">
        {accounts.map((account) => {
          const recent = transactions.filter((transaction) => transaction.accountId === account.id).slice(0, 3)
          return (
            <article className="portal-account-detail-card" key={account.id}>
              <div className={`portal-account-art ${account.color}`}>
                <div className="portal-account-art-head"><span>BankSphere</span><span>●●●</span></div>
                <div className="portal-account-art-chip">▦</div>
                <strong>{account.number}</strong>
                <div className="portal-account-art-foot"><span>{account.name.toUpperCase()}</span><span>INR</span></div>
              </div>
              <div className="portal-account-detail">
                <div className="portal-account-detail-heading"><div><span className="portal-account-type">{account.type} ACCOUNT</span><h2>{account.name}</h2></div><span className="portal-status"><i /> {account.status}</span></div>
                <div className="portal-account-detail-balance"><span>Current balance</span><strong>{formatMoney(account.balance)}</strong><small>{formatMoney(account.available)} available</small></div>
                <div className="portal-detail-grid">
                  <div><span>Account number</span><strong>{account.number}</strong></div>
                  <div><span>Account type</span><strong>{account.type}</strong></div>
                  <div><span>Home branch</span><strong>{account.branch}</strong></div>
                  <div><span>Opened on</span><strong>{formatDate(account.opened)}</strong></div>
                </div>
                <div className="portal-account-recent">
                  <div className="portal-account-recent-heading"><strong>Recent activity</strong><Link to={`${customerPath('/transactions')}?account=${account.id}`}>View activity →</Link></div>
                  {recent.map((transaction) => (
                    <div className="portal-mini-transaction" key={transaction.id}>
                      <span>{transaction.title}<small>{formatDate(transaction.date, { day: 'numeric', month: 'short' })}</small></span>
                      <strong className={transaction.amount > 0 ? 'positive' : ''}>{transaction.amount > 0 ? '+' : '−'}{formatMoney(Math.abs(transaction.amount))}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          )
        })}
      </div>
      <p className="portal-footnote">Account opening, freeze, and closure requests will be available when the banking service is connected.</p>
    </div>
  )
}
