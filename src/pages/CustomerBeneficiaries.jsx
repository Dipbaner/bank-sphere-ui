import { useState } from 'react'
import { useCustomerBanking } from '../customer/useCustomerBanking'

const emptyForm = { name: '', bank: '', accountNumber: '', ifsc: '' }

export default function CustomerBeneficiaries() {
  const { beneficiaries, addBeneficiary, updateBeneficiary, removeBeneficiary } = useCustomerBanking()
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId('')
    setError('')
  }

  function submit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    const accountNumber = form.accountNumber.replace(/\s/g, '')
    if (!/^\d{8,18}$/.test(accountNumber)) return setError('Enter an account number between 8 and 18 digits.')
    if (!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(form.ifsc.trim())) return setError('Enter a valid 11-character IFSC code.')
    const duplicate = beneficiaries.some((item) => item.accountNumber === accountNumber && item.id !== editingId)
    if (duplicate) return setError('This account is already in your beneficiaries.')
    const beneficiary = {
      name: form.name.trim(),
      bank: form.bank.trim(),
      accountNumber,
      account: `•••• ${accountNumber.slice(-4)}`,
      ifsc: form.ifsc.trim().toUpperCase(),
    }
    if (editingId) {
      updateBeneficiary(editingId, beneficiary)
      setSuccess('Beneficiary details updated.')
    } else {
      addBeneficiary(beneficiary)
      setSuccess('Beneficiary added successfully.')
    }
    resetForm()
  }

  function edit(beneficiary) {
    setEditingId(beneficiary.id)
    setForm({
      name: beneficiary.name,
      bank: beneficiary.bank,
      accountNumber: beneficiary.accountNumber,
      ifsc: beneficiary.ifsc,
    })
    setSuccess('')
    setError('')
    document.getElementById('beneficiary-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function remove(beneficiary) {
    if (!window.confirm(`Remove ${beneficiary.name} from your beneficiaries?`)) return
    removeBeneficiary(beneficiary.id)
    if (editingId === beneficiary.id) resetForm()
    setSuccess(`${beneficiary.name} was removed.`)
  }

  return (
    <div className="portal-page">
      <section className="portal-page-heading"><div><p className="portal-eyebrow">PAYMENTS</p><h1>Beneficiaries</h1><p className="portal-subtitle">Manage the people and accounts you send money to.</p></div><span className="portal-count-pill">{beneficiaries.length} saved</span></section>
      {success && <div className="portal-form-success" role="status">{success}</div>}
      <section className="portal-beneficiary-list">
        {beneficiaries.length ? beneficiaries.map((beneficiary) => (
          <article className="portal-beneficiary-card" key={beneficiary.id}>
            <div className="portal-beneficiary-avatar">{beneficiary.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div>
            <div className="portal-beneficiary-info"><strong>{beneficiary.name}</strong><span>{beneficiary.bank}</span><small>{beneficiary.account} <i>·</i> IFSC {beneficiary.ifsc}</small></div>
            <span className="portal-beneficiary-date">Added {beneficiary.added}</span>
            <div className="portal-beneficiary-actions">
              <button className="portal-small-button" onClick={() => edit(beneficiary)}>Edit</button>
              <button className="portal-small-button danger" onClick={() => remove(beneficiary)}>Remove</button>
            </div>
          </article>
        )) : <div className="portal-empty-state"><span>＋</span><h2>No beneficiaries yet</h2><p>Add someone you trust to make transfers easier.</p></div>}
      </section>
      <section className="portal-form-card portal-beneficiary-form" id="beneficiary-form">
        <div className="portal-form-section-title"><span>{editingId ? '✎' : '＋'}</span><div><strong>{editingId ? 'Edit beneficiary' : 'Add a beneficiary'}</strong><small>Enter the account details exactly as provided by the recipient.</small></div></div>
        <form onSubmit={submit}>
          <div className="portal-form-grid">
            <label className="portal-form-field">Recipient name<input name="name" value={form.name} onChange={updateField} placeholder="Name on the account" minLength={2} maxLength={70} required /></label>
            <label className="portal-form-field">Bank name<input name="bank" value={form.bank} onChange={updateField} placeholder="Bank or financial institution" minLength={2} maxLength={60} required /></label>
            <label className="portal-form-field">Account number<input name="accountNumber" value={form.accountNumber} onChange={updateField} placeholder="8–18 digit account number" inputMode="numeric" required /></label>
            <label className="portal-form-field">IFSC code<input name="ifsc" value={form.ifsc} onChange={updateField} placeholder="e.g. BSBK0001024" maxLength={11} required /></label>
          </div>
          {error && <div className="portal-form-error" role="alert">{error}</div>}
          <div className="portal-form-actions"><button className="portal-button portal-button-primary" type="submit">{editingId ? 'Save changes' : 'Add beneficiary'}</button>{editingId && <button className="portal-button portal-button-quiet" type="button" onClick={resetForm}>Cancel</button>}</div>
        </form>
        <p className="portal-form-disclaimer">Demo only. Bank-account validation and any new-beneficiary activation delay require a connected backend.</p>
      </section>
    </div>
  )
}
