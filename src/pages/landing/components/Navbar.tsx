import { ArrowRight, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'

function Brand() {
  return (
    <Link aria-label="DelivFlow home" className="brand" to="/">
      <span aria-hidden="true" className="brand-mark">
        <span />
      </span>
      <span>DelivFlow</span>
    </Link>
  )
}

function Navbar() {
  return (
    <header className="landing-navbar">
      <nav aria-label="Main navigation" className="landing-container navbar-inner">
        <Brand />
        <div className="navbar-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#for-teams">For Teams</a>
        </div>
        <div className="navbar-actions">
          <Link className="navbar-sign-in" to="/login">
            Sign In
          </Link>
          <Link className="button button-primary navbar-cta" to="/register">
            Get Started <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>
        <details className="mobile-nav">
          <summary aria-label="Open navigation menu">
            <Menu aria-hidden="true" size={22} />
          </summary>
          <div className="mobile-nav-panel">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#for-teams">For Teams</a>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Get Started</Link>
          </div>
        </details>
      </nav>
    </header>
  )
}

export default Navbar
