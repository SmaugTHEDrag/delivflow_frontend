import { ArrowRight, BriefcaseBusiness, Check, Plus } from 'lucide-react'

const steps = [
  {
    icon: Plus,
    tone: 'blue',
    title: 'Create a Workspace',
    description: 'Set up your workspace for clients and team.',
  },
  {
    icon: BriefcaseBusiness,
    tone: 'purple',
    title: 'Set Up Your Project',
    description: 'Add projects and invite team members.',
  },
  {
    icon: Check,
    tone: 'green',
    title: 'Manage Deliverables and Collaborate with Clients',
    description: '',
  },
]

function HowItWorks() {
  return (
    <section aria-labelledby="steps-title" className="content-row steps-row" id="how-it-works">
      <div className="section-intro steps-intro">
        <span className="section-kicker">How It Works</span>
        <h2 id="steps-title">Get started in 3 simple steps.</h2>
      </div>
      <div className="steps-list">
        {steps.map(({ icon: Icon, tone, title, description }, index) => (
          <div className="step-wrap" key={title}>
            <article className="step-card">
              <div className={`step-icon tone-${tone}`}>
                <Icon aria-hidden="true" size={25} />
                <span>{index + 1}</span>
              </div>
              <h3>{title}</h3>
              {description && <p>{description}</p>}
            </article>
            {index < steps.length - 1 && (
              <ArrowRight aria-hidden="true" className="step-arrow" size={32} />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
