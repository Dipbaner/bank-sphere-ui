import { Link } from 'react-router-dom'

const portals = [
  {
    role: 'Customer',
    path: '/preview/customer',
    icon: 'CU',
    tone: 'blue',
    description: 'Explore personal accounts, transfers, beneficiaries, transaction history, and statements.',
    features: ['Account overview', 'Send a demo transfer', 'Manage beneficiaries', 'Export activity'],
  },
  {
    role: 'Employee',
    path: '/preview/employee',
    icon: 'EM',
    tone: 'green',
    description: 'Preview customer support and day-to-day bank operations.',
    features: ['Customer search', 'KYC review queue', 'Transaction monitoring', 'Service requests'],
  },
  {
    role: 'Administrator',
    path: '/preview/admin',
    icon: 'AD',
    tone: 'violet',
    description: 'Preview system-wide oversight, user administration, and bank activity.',
    features: ['Analytics overview', 'User and account controls', 'Audit trail', 'System settings'],
  },
]

export default function PreviewHome() {
  return (
    <main className="preview-home">
      <header className="preview-home-header">
        <Link className="preview-home-brand" to="/"><span className="portal-brand-mark">B</span>Bank<span>Sphere</span></Link>
        <div><span className="preview-home-status"><i /> Frontend preview</span><Link className="preview-login-link" to="/login">Sign in</Link></div>
      </header>
      <section className="preview-home-hero">
        <p className="portal-eyebrow">BANKSPHERE · BANKING, REIMAGINED</p>
        <h1>Explore the BankSphere experience</h1>
        <p>Choose a portal to explore the frontend. These previews work without a backend or account.</p>
      </section>
      <section className="preview-role-grid" aria-label="Available demo portals">
        {portals.map((portal) => (
          <article className="preview-role-card" key={portal.role}>
            <div className={`preview-role-icon ${portal.tone}`}>{portal.icon}</div>
            <span className="preview-role-tag">DEMO PORTAL</span>
            <h2>{portal.role}</h2>
            <p>{portal.description}</p>
            <ul>{portal.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
            <Link className="portal-button portal-button-primary" to={portal.path}>Explore {portal.role.toLowerCase()} portal <span>→</span></Link>
          </article>
        ))}
      </section>
      <footer className="preview-home-footer">Preview mode uses sample data. No real accounts, personal information, or money are involved.</footer>
    </main>
  )
}
