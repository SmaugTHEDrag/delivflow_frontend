import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorks from './components/HowItWorks'
import TargetUsers from './components/TargetUsers'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import './landing-page.css'

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <HeroSection />
        <div className="landing-container landing-content">
          <FeaturesSection />
          <HowItWorks />
          <TargetUsers />
          <FinalCTA />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
