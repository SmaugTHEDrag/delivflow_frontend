import { ArrowRight, Rocket } from 'lucide-react'
import { Link } from 'react-router-dom'

function FinalCTA() {
  return (
    <section aria-labelledby="final-cta-title" className="final-cta">
      <Rocket aria-hidden="true" className="cta-rocket" size={40} />
      <div>
        <h2 id="final-cta-title">Bring Your Projects Into Focus.</h2>
        <p>Start organizing your projects and client collaboration with DelivFlow.</p>
      </div>
      <Link className="button cta-button" to="/register">
        Get Started <ArrowRight aria-hidden="true" size={17} />
      </Link>
    </section>
  )
}

export default FinalCTA
