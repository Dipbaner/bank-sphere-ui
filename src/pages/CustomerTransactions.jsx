import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { downloadCsv, formatDate, formatMoney } from '../customer/customerUtils'
import { useCustomerBanking } from '../customer/useCustomerBanking'

const categories = ['All types', 'Income', 'Transfer', 'Shopping', 'Food & drink', 'Bills', 'Travel']

export default function CustomerTransactions() {
  const { accounts, transactions } = useCustomerBanking()
  const [searchParams, setSearchParams] = useSearchParams()
  const [category, setCategory] = useState('All types')
  const [query, setQuery] = useState('')
  const initialAccount = searchParams.get('account') || 'all'
  const [accountId, setAccountId] = useState(initialAccount)
  const filtered = useMemo(() => transactions.filter((transaction) => {
    const matchesCategory = category === 'All types' || transaction.category === category
    const matchesAccount = accountId === 'all' || transaction.accountId === accountId
    const term = query.trim().toLowerCase()
    const matchesQuery = !term || [transaction.title, transaction.reference, transaction.category, transaction.account].some((value) => value.toLowerCase().includes(term))
    return matchesCategory && matchesAccount && matchesQuery
  }), [transactions, category, accountId, query])

  function changeAccount(value) {
    setAccountId(value)
    setSearchParams(value === 'all' ? {} : { account: value }, { replace: true })
  }

  function exportCsv() {
    downloadCsv('banksphere-transactions.csv', [
      ['Date', 'Description', 'Category', 'Account', 'Reference', 'Status', 'Amount (INR)'],
      ...filtered.map((transaction) => [transaction.date, transaction.title, transaction.category, transaction.account, transaction.reference, transaction.status, transaction.amount]),
    ])
  }

  return (
    <div className="portal-page">
      <section className="portal-page-heading"><div><p className="portal-eyebrow">YOUR MONEY</p><h1>Transactions</h1><p className="portal-subtitle">Search and review activity across your accounts.</p></div><button className="portal-button portal-button-quiet" onClick={exportCsv}>↓ Export CSV</button></section>
      <section className="portal-filter-card">
        <label className="portal-search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search transactions or reference" aria-label="Search transactions" /></label>
        <label className="portal-filter-field"><span>TYPE</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="portal-filter-field"><span>ACCOUNT</span><select value={accountId} onChange={(event) => changeAccount(event.target.value)}><option value="all">All accounts</option>{accounts.map((account) => <option value={account.id} key={account.id}>{account.name}</option>)}</select></label>
        <span className="portal-results-count">{filtered.length} results</span>
      </section>
      <section className="portal-table-card">
        <div className="portal-section-heading portal-table-heading"><div><h2>All activity</h2><p>Newest transactions appear first.</p></div></div>
        {filtered.length ? <div className="portal-table-wrap">
          <table className="portal-table portal-transaction-table">
            <thead><tr><th>TRANSACTION</th><th>DATE & TIME</th><th>REFERENCE</th><th>ACCOUNT</th><th>STATUS</th><th className="align-right">AMOUNT</th></tr></thead>
            <tbody>{filtered.map((transaction) => <tr key={transaction.id}>
              <td><div className="portal-transaction-name"><span className={`portal-transaction-icon ${transaction.amount > 0 ? 'income' : ''}`}>{transaction.amount > 0 ? '↓' : '↗'}</span><span><strong>{transaction.title}</strong><small>{transaction.category}</small></span></div></td>
              <td>{formatDate(transaction.date, { day: 'numeric', month: 'short', year: 'numeric' })}<small className="portal-cell-secondary">{formatDate(transaction.date, { hour: 'numeric', minute: '2-digit' })}</small></td>
              <td className="portal-reference">{transaction.reference}</td><td>{transaction.account}</td><td><span className="portal-status"><i /> {transaction.status}</span></td>
              <td className={`align-right portal-amount ${transaction.amount > 0 ? 'positive' : ''}`}>{transaction.amount > 0 ? '+' : '−'}{formatMoney(Math.abs(transaction.amount))}</td>
            </tr>)}</tbody>
          </table>
        </div> : <div className="portal-empty-state"><span>⌕</span><h2>No matching transactions</h2><p>Try a different search or filter.</p><button className="portal-text-link" onClick={() => { setQuery(''); setCategory('All types'); changeAccount('all') }}>Clear filters</button></div>}
      </section>
      <p className="portal-footnote">Transaction activity is sample data for this demo. Filters and CSV export operate in your browser.</p>
    </div>
  )
}
