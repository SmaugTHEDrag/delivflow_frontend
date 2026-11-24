import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardPreview from './DashboardPreview'

function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="hero-section">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="landing-container hero-inner">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <Sparkles aria-hidden="true" size={14} />
            Project &amp; Client Collaboration Platform
          </div>
          <h1 id="hero-title">
            Deliver Projects.
            <br />
            <span>Keep Clients</span> in Sync.
          </h1>
          <p>
            Manage your clients, projects, and deliverables in one simple
            workspace. Keep your team organized and every project moving
            forward.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/register">
              Get Started <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <a className="button button-outline" href="#features">
              <Play aria-hidden="true" size={15} />
              Explore Features
            </a>
          </div>
        </div>
        <DashboardPreview />
      </div>
    </section>
  )
}

export default HeroSection
