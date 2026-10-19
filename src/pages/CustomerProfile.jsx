import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useCustomerBanking } from '../customer/useCustomerBanking'
import { formatMoney } from '../customer/customerUtils'

const profileHighlights = [
  { label: 'KYC status', value: 'Verified', tone: 'success' },
  { label: 'MFA', value: 'Enabled', tone: 'success' },
  { label: 'Risk score', value: 'Low', tone: 'info' },
  { label: 'Account type', value: 'Retail', tone: 'neutral' },
]

const securityChecks = [
  { label: 'Password strength', value: 'Strong', status: 'good' },
  { label: 'Authenticator', value: 'Set up', status: 'good' },
  { label: 'Login alerts', value: 'On', status: 'good' },
  { label: 'Device trust', value: '3 trusted devices', status: 'neutral' },
]

export default function CustomerProfile() {
  const { user } = useAuth()
  const { accounts } = useCustomerBanking()
  const primaryAccount = accounts[0]
  const customerName = user?.email?.split('@')[0]?.replace(/[._-]/g, ' ') || 'Alex Morgan'

  return (
    <div className="portal-page">
      <section className="portal-page-heading portal-profile-header">
        <div>
          <p className="portal-eyebrow">PROFILE & SECURITY</p>
          <h1>{customerName}</h1>
          <p className="portal-subtitle">Manage your personal information, KYC, and account protection.</p>
        </div>
        <Link className="portal-button portal-button-primary" to="/change-password">Change password</Link>
      </section>

      <section className="portal-overview-grid portal-profile-summary">
        {profileHighlights.map((item) => (
          <article className="portal-summary-card" key={item.label}>
            <div className={`portal-summary-icon ${item.tone === 'success' ? 'portal-summary-icon-green' : item.tone === 'info' ? 'portal-summary-icon-blue' : 'portal-summary-icon-grey'}`}>✓</div>
            <span className="portal-card-label">{item.label}</span>
            <strong>{item.value}</strong>
            <span className="portal-summary-foot">Updated today</span>
          </article>
        ))}
      </section>

      <section className="portal-section portal-profile-grid">
        <div className="portal-form-card">
          <div className="portal-section-heading">
            <div><h2>Personal details</h2><p>Profile information used for your BankSphere account.</p></div>
          </div>

          <div className="portal-profile-details">
            <div>
              <span>Full name</span>
              <strong>{customerName}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{user?.email || 'alex.morgan@banksphere.example'}</strong>
            </div>
            <div>
              <span>Mobile</span>
              <strong>+91 98765 43210</strong>
            </div>
            <div>
              <span>Resident city</span>
              <strong>Bengaluru</strong>
            </div>
            <div>
              <span>Address</span>
              <strong>12th Cross, Indiranagar, Bengaluru 560038</strong>
            </div>
            <div>
              <span>Preferred language</span>
              <strong>English</strong>
            </div>
          </div>
        </div>

        <div className="portal-form-card">
          <div className="portal-section-heading">
            <div><h2>Primary account</h2><p>Summary of your main account relationship.</p></div>
          </div>
          <div className="portal-profile-account-card">
            <div className="portal-account-card-top">
              <div className="portal-account-icon blue">▤</div>
              <span className="portal-status"><i /> Active</span>
            </div>
            <span className="portal-account-type">{primaryAccount?.type || 'Savings'} account</span>
            <strong className="portal-account-balance">{formatMoney(primaryAccount?.balance || 84250.75)}</strong>
            <div className="portal-account-card-bottom">
              <span>{primaryAccount?.name || 'Everyday savings'}</span>
              <span>{primaryAccount?.number || '•••• •••• 4821'}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="portal-section portal-profile-grid">
        <div className="portal-form-card">
          <div className="portal-section-heading">
            <div><h2>Security controls</h2><p>Recent settings that protect your account.</p></div>
          </div>
          <div className="portal-security-list">
            {securityChecks.map((check) => (
              <div key={check.label} className="portal-security-item">
                <div>
                  <span>{check.label}</span>
                  <strong>{check.value}</strong>
                </div>
                <span className={`portal-security-pill ${check.status}`}>{check.status === 'good' ? 'Healthy' : 'Info'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="portal-form-card">
          <div className="portal-section-heading">
            <div><h2>Preferences</h2><p>Choose what you want to receive and how alerts are delivered.</p></div>
          </div>
          <div className="portal-preference-list">
            <label className="portal-toggle-row">
              <div><strong>Transaction alerts</strong><small>Receive notifications for every transfer</small></div>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="portal-toggle-row">
              <div><strong>Daily summary</strong><small>Email me a summary each evening</small></div>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="portal-toggle-row">
              <div><strong>Security warnings</strong><small>Push alerts for unusual activity</small></div>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </div>
      </section>
    </div>
  )
}
