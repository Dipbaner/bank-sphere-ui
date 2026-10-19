import { useMemo, useState } from 'react'
import { downloadCsv, formatDate, formatMoney } from '../customer/customerUtils'
import { useCustomerBanking } from '../customer/useCustomerBanking'

const today = new Date()
const monthStart = new Date(today.getFullYear(), today.getMonth() - 6, 1).toISOString().slice(0, 10)
const todayValue = today.toISOString().slice(0, 10)

export default function CustomerStatements() {
  const { accounts, transactions } = useCustomerBanking()
  const [accountId, setAccountId] = useState(accounts[0]?.id || 'all')
  const [from, setFrom] = useState(monthStart)
  const [to, setTo] = useState(todayValue)
  const [error, setError] = useState('')
  const statement = useMemo(() => transactions.filter((transaction) => {
    const date = transaction.date.slice(0, 10)
    return (accountId === 'all' || transaction.accountId === accountId) && date >= from && date <= to
  }).sort((a, b) => b.date.localeCompare(a.date)), [transactions, accountId, from, to])
  const net = statement.reduce((sum, transaction) => sum + transaction.amount, 0)

  function exportStatement() {
    if (from && to && from > to) return setError('The start date must be on or before the end date.')
    setError('')
    const accountName = accounts.find((account) => account.id === accountId)?.name || 'All accounts'
    downloadCsv(`banksphere-statement-${from}-to-${to}.csv`, [
      ['BankSphere demo statement'],
      ['Account', accountName],
      ['Period', `${from} to ${to}`],
      [],
      ['Date', 'Description', 'Reference', 'Status', 'Debit (INR)', 'Credit (INR)'],
      ...statement.map((transaction) => [
        transaction.date,
        transaction.title,
        transaction.reference,
        transaction.status,
        transaction.amount < 0 ? Math.abs(transaction.amount).toFixed(2) : '',
        transaction.amount > 0 ? transaction.amount.toFixed(2) : '',
      ]),
      [],
      ['Net movement', '', '', '', '', net.toFixed(2)],
    ])
  }

  return (
    <div className="portal-page">
      <section className="portal-page-heading"><div><p className="portal-eyebrow">DOCUMENTS</p><h1>Statements</h1><p className="portal-subtitle">Choose an account and date range to prepare a statement.</p></div></section>
      <section className="portal-statement-intro"><div className="portal-statement-icon">▤</div><div><h2>Your account activity, your way</h2><p>Filter transactions for a date range and download a CSV statement for your records.</p></div></section>
      <section className="portal-form-card portal-statement-filters">
        <div className="portal-section-heading"><div><h2>Statement details</h2><p>Select the account and period you need.</p></div></div>
        <div className="portal-statement-filter-grid">
          <label className="portal-form-field">Account<select value={accountId} onChange={(event) => setAccountId(event.target.value)}><option value="all">All accounts</option>{accounts.map((account) => <option value={account.id} key={account.id}>{account.name} · {account.number}</option>)}</select></label>
          <label className="portal-form-field">From date<input type="date" value={from} max={to || undefined} onChange={(event) => setFrom(event.target.value)} required /></label>
          <label className="portal-form-field">To date<input type="date" value={to} min={from || undefined} max={todayValue} onChange={(event) => setTo(event.target.value)} required /></label>
          <button className="portal-button portal-button-primary portal-statement-download" onClick={exportStatement}>↓ Download statement</button>
        </div>
        {error && <div className="portal-form-error" role="alert">{error}</div>}
      </section>
      <section className="portal-table-card">
        <div className="portal-section-heading portal-table-heading"><div><h2>Statement preview</h2><p>{from && to ? `${formatDate(from)} – ${formatDate(to)}` : 'Select a date range'}</p></div><span className="portal-count-pill">{statement.length} entries</span></div>
        <div className="portal-statement-summary"><div><span>Money in</span><strong className="positive">{formatMoney(statement.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0))}</strong></div><div><span>Money out</span><strong>{formatMoney(Math.abs(statement.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0)))}</strong></div><div><span>Net movement</span><strong className={net >= 0 ? 'positive' : 'negative'}>{net >= 0 ? '+' : '−'}{formatMoney(Math.abs(net))}</strong></div></div>
        {statement.length ? <div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>DATE</th><th>DESCRIPTION</th><th>REFERENCE</th><th className="align-right">DEBIT</th><th className="align-right">CREDIT</th></tr></thead><tbody>{statement.map((transaction) => <tr key={transaction.id}><td>{formatDate(transaction.date, { day: 'numeric', month: 'short', year: 'numeric' })}</td><td><strong>{transaction.title}</strong><small className="portal-cell-secondary">{transaction.category}</small></td><td className="portal-reference">{transaction.reference}</td><td className="align-right">{transaction.amount < 0 ? formatMoney(Math.abs(transaction.amount)) : '—'}</td><td className="align-right positive">{transaction.amount > 0 ? formatMoney(transaction.amount) : '—'}</td></tr>)}</tbody></table></div> : <div className="portal-empty-state"><span>▤</span><h2>No activity in this period</h2><p>Try a different date range or account.</p></div>}
      </section>
      <p className="portal-footnote">This preview and CSV are generated from sample data. PDF statements will be available after backend integration.</p>
    </div>
  )
}
