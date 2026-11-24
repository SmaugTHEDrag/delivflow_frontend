import freelancerIllustration from '@/assets/images/freelancer.svg'
import agencyIllustration from '@/assets/images/agency.svg'

function TargetUsers() {
  return (
    <section aria-labelledby="audience-title" className="target-users" id="for-teams">
      <div className="target-heading">
        <span className="section-kicker">Perfect For</span>
        <h2 id="audience-title">Freelancers &amp;<br />Small Agencies</h2>
      </div>
      <article className="audience-card">
        <img alt="" height="88" src={freelancerIllustration} width="126" />
        <div>
          <h3>Freelancers</h3>
          <p>Manage multiple clients and projects independently.</p>
        </div>
      </article>
      <article className="audience-card">
        <img alt="" height="88" src={agencyIllustration} width="142" />
        <div>
          <h3>Small Agencies</h3>
          <p>Organize team collaboration and client projects.</p>
        </div>
      </article>
    </section>
  )
}

export default TargetUsers
