import {
  Check,
  FolderKanban,
  MessageSquareText,
  PanelsTopLeft,
  UsersRound,
} from 'lucide-react'

const features = [
  {
    icon: UsersRound,
    tone: 'blue',
    title: 'Workspace Management',
    description: 'Organize projects and team members in one workspace.',
  },
  {
    icon: FolderKanban,
    tone: 'purple',
    title: 'Project Management',
    description: 'Keep project information and progress organized.',
  },
  {
    icon: PanelsTopLeft,
    tone: 'green',
    title: 'Deliverable Management',
    description: 'Track deliverables and their status.',
  },
  {
    icon: MessageSquareText,
    tone: 'orange',
    title: 'Client Collaboration',
    description: 'Give clients a clear place to review and provide feedback.',
  },
]

function FeaturesSection() {
  return (
    <section aria-labelledby="features-title" className="content-row features-row" id="features">
      <div className="section-intro challenge-intro">
        <span className="section-kicker">The Challenge</span>
        <h2 id="features-title">Stop juggling multiple tools.</h2>
        <p>Project information is scattered, client feedback is messy, and progress is unclear.</p>
      </div>
      <div className="benefit-list">
        <h3>With DelivFlow, you can:</h3>
        <ul>
          <li><Check aria-hidden="true" size={15} />Keep everything in one place</li>
          <li><Check aria-hidden="true" size={15} />Streamline client communication</li>
          <li><Check aria-hidden="true" size={15} />Track progress effortlessly</li>
        </ul>
      </div>
      <div className="feature-grid">
        {features.map(({ icon: Icon, tone, title, description }) => (
          <article className="feature-card" key={title}>
            <span className={`feature-icon tone-${tone}`}>
              <Icon aria-hidden="true" size={19} />
            </span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeaturesSection
