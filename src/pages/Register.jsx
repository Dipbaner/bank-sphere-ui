import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, errMsg, fieldErrors } from '../api/client'
import Alert from '../components/Alert'
import AuthCard from '../components/AuthCard'
import Field from '../components/Field'

const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  function validate() {
    const e = {}
    if (!/^[A-Za-z ]{2,60}$/.test(form.name)) e.name = 'Name must be 2-60 letters'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number'
    if (!PASSWORD_RE.test(form.password)) e.password = 'Use 8+ characters with upper, lower, digit and a special character'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  async function submit(ev) {
    ev.preventDefault()
    setError('')
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return
    setBusy(true)
    try {
      await api.post('/api/auth/register', {
        name: form.name, email: form.email, phone: form.phone, password: form.password,
      })
      setDone(true)
    } catch (err) {
      setErrors(fieldErrors(err))          // the server repeats every rule
      setError(errMsg(err))
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <AuthCard title="Check your email" footer={<Link to="/login">Back to sign in</Link>}>
        <Alert type="ok">We sent a verification link to {form.email}. Open it to activate your account.</Alert>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Create your account" footer={<Link to="/login">Already registered? Sign in</Link>}>
      <Alert>{error}</Alert>
      <form onSubmit={submit} noValidate>
        <Field label="Full name" value={form.name} onChange={set('name')} error={errors.name} />
        <Field label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
        <Field label="Mobile number" type="tel" value={form.phone} onChange={set('phone')} error={errors.phone} />
        <Field label="Password" type="password" value={form.password} onChange={set('password')} error={errors.password} />
        <Field label="Confirm password" type="password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        <button className="btn" disabled={busy}>{busy ? 'Creating...' : 'Create account'}</button>
      </form>
    </AuthCard>
  )
}