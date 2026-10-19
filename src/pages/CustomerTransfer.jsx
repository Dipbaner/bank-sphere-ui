import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatMoney } from '../customer/customerUtils'
import { useCustomerBanking, useCustomerPath } from '../customer/useCustomerBanking'

export default function CustomerTransfer() {
  const { accounts, beneficiaries, transfer } = useCustomerBanking()
  const customerPath = useCustomerPath()
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '')
  const [beneficiaryId, setBeneficiaryId] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState(null)
  const selectedAccount = accounts.find((account) => account.id === fromAccountId)
  const selectedBeneficiary = beneficiaries.find((beneficiary) => beneficiary.id === beneficiaryId)

  function submit(event) {
    event.preventDefault()
    setError('')
    try {
      setCompleted(transfer({ fromAccountId, beneficiaryId, amount, note }))
    } catch (err) {
      setError(err.message)
    }
  }

  if (completed) {
    return (
      <div className="portal-page">
        <div className="portal-success-card">
          <div className="portal-success-mark">✓</div>
          <p className="portal-eyebrow">DEMO TRANSFER COMPLETE</p>
          <h1>Money sent successfully</h1>
          <p className="portal-subtitle">{formatMoney(Math.abs(completed.amount))} sent to {selectedBeneficiary?.name || completed.title.replace('Payment to ', '')}.</p>
          <div className="portal-receipt"><span>Reference number</span><strong>{completed.reference}</strong><span>From account</span><strong>{completed.account}</strong></div>
          <p className="portal-footnote">This is a demo transaction only. No money was moved.</p>
          <div className="portal-success-actions"><button className="portal-button portal-button-primary" onClick={() => { setCompleted(null); setAmount(''); setNote('') }}>Make another transfer</button><Link className="portal-button portal-button-quiet" to={customerPath('/transactions')}>View transactions</Link></div>
        </div>
      </div>
    )
  }

  return (
    <div className="portal-page">
      <section className="portal-page-heading">
        <div><p className="portal-eyebrow">PAYMENTS</p><h1>Transfer money</h1><p className="portal-subtitle">Send money to one of your saved beneficiaries.</p></div>
      </section>
      <div className="portal-transfer-layout">
        <form className="portal-form-card" onSubmit={submit}>
          <div className="portal-form-section-title"><span>01</span><div><strong>Payment details</strong><small>Choose where the money is coming from and going to.</small></div></div>
          <label className="portal-form-field">From account
            <select value={fromAccountId} onChange={(event) => setFromAccountId(event.target.value)} required>
              {accounts.map((account) => <option value={account.id} key={account.id}>{account.name} · {account.number} · {formatMoney(account.available)}</option>)}
            </select>
          </label>
          <label className="portal-form-field">Send to
            <select value={beneficiaryId} onChange={(event) => setBeneficiaryId(event.target.value)} required>
              <option value="">Choose a beneficiary</option>
              {beneficiaries.map((beneficiary) => <option value={beneficiary.id} key={beneficiary.id}>{beneficiary.name} · {beneficiary.bank} · {beneficiary.account}</option>)}
            </select>
          </label>
          {beneficiaries.length === 0 && <div className="portal-inline-note">Add a beneficiary before making a transfer. <Link to={customerPath('/beneficiaries')}>Manage beneficiaries →</Link></div>}
          <label className="portal-form-field">Amount
            <div className="portal-amount-input"><span>₹</span><input type="number" min="0.01" max={selectedAccount?.available} step="0.01" inputMode="decimal" placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value)} required /><span>INR</span></div>
          </label>
          <div className="portal-available-hint">Available balance: <strong>{formatMoney(selectedAccount?.available || 0)}</strong></div>
          <label className="portal-form-field">Payment note <span className="portal-optional">OPTIONAL</span>
            <input value={note} maxLength={80} onChange={(event) => setNote(event.target.value)} placeholder="What is this payment for?" />
          </label>
          {error && <div className="portal-form-error" role="alert">{error}</div>}
          <button className="portal-button portal-button-primary portal-submit" disabled={!beneficiaries.length}>Review and send <span>→</span></button>
          <p className="portal-form-disclaimer">Demo only. This transfer will only update the sample balance on this page.</p>
        </form>
        <aside className="portal-transfer-aside">
          <div className="portal-security-card"><div className="portal-security-icon">◇</div><h3>Your money, protected</h3><p>Transfers in a real account would be secured with authentication and transaction monitoring.</p><Link to="/preview">Explore the other portals →</Link></div>
          <div className="portal-beneficiary-prompt"><span className="portal-card-label">SAVED BENEFICIARIES</span><strong>{beneficiaries.length}</strong><p>People you can send money to.</p><Link className="portal-text-link" to={customerPath('/beneficiaries')}>Manage beneficiaries →</Link></div>
        </aside>
      </div>
    </div>
  )
}
