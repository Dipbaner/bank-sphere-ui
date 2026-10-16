import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, errMsg } from '../api/client'
import Alert from '../components/Alert'
import AuthCard from '../components/AuthCard'
import Field from '../components/Field'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const { data } = await api.post('/api/auth/forgot-password', { email })
      setMessage(data.message)          // identical whether or not the account exists
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard title="Reset your password" subtitle="We will email you a link that works once for 15 minutes."
      footer={<Link to="/login">Back to sign in</Link>}>
      <Alert>{error}</Alert>
      {message
        ? <Alert type="ok">{message}</Alert>
        : (
          <form onSubmit={submit}>
            <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
            <button className="btn" disabled={busy}>{busy ? 'Sending...' : 'Send reset link'}</button>
          </form>
        )}
    </AuthCard>
  )
}