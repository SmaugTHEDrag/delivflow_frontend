import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-container footer-inner">
        <div className="footer-brand">
          <Link aria-label="DelivFlow home" className="brand" to="/">
            <span aria-hidden="true" className="brand-mark"><span /></span>
            <span>DelivFlow</span>
          </Link>
          <span className="footer-divider" />
          <p>Manage clients. Deliver great work.</p>
        </div>
        <nav aria-label="Footer navigation" className="footer-nav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#for-teams">For Teams</a>
        </nav>
        <div className="footer-account">
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
        </div>
        <p className="copyright">© 2025 DelivFlow. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
