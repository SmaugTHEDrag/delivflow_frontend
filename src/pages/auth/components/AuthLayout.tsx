import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthLogo from './AuthLogo'
import '../auth.css'

interface AuthLayoutProps {
  brandPanel: React.ReactNode
  form: React.ReactNode
}

function AuthLayout({ brandPanel, form }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <header className="auth-topbar">
        <AuthLogo />
        <Link className="auth-back-link" to="/">
          <ArrowLeft aria-hidden="true" size={16} />
          Back to Home
        </Link>
      </header>
      <main className="auth-main">
        <div className="auth-shell">
          <div className="auth-brand-column">{brandPanel}</div>
          <div className="auth-form-column">{form}</div>
        </div>
      </main>
      <footer className="auth-footer">
        <div className="auth-footer-brand">
          <AuthLogo />
          <span aria-hidden="true" className="auth-footer-divider" />
          <p>Manage clients. Deliver great work.</p>
        </div>
        <nav aria-label="Footer navigation" className="auth-footer-nav">
          <a href="/#features">Features</a>
          <a href="/#how-it-works">How It Works</a>
          <a href="/#for-teams">For Teams</a>
        </nav>
        <p>© 2025 DelivFlow. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default AuthLayout
