import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CircleHelp,
  Folder,
  LayoutDashboard,
  MessageSquare,
  MoreHorizontal,
  PanelsTopLeft,
  UsersRound,
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', selected: true },
  { icon: UsersRound, label: 'Workspaces' },
  { icon: BriefcaseBusiness, label: 'Projects' },
  { icon: PanelsTopLeft, label: 'Deliverables' },
  { icon: MessageSquare, label: 'Messages' },
  { icon: Bell, label: 'Notifications' },
]

const deadlines = [
  { color: 'purple', title: 'Website Redesign', due: 'Due in 2 days' },
  { color: 'blue', title: 'Mobile App UI', due: 'Due in 4 days' },
  { color: 'green', title: 'Brand Guidelines', due: 'Due in 1 week' },
]

function DashboardPreview() {
  return (
    <div aria-label="Preview of the DelivFlow dashboard" className="dashboard">
      <aside className="dashboard-sidebar">
        <div aria-hidden="true" className="dashboard-logo">
          <span />
        </div>
        <div className="dashboard-menu">
          {menuItems.map(({ icon: Icon, label, selected }) => (
            <div
              className={`dashboard-menu-item${selected ? ' is-selected' : ''}`}
              key={label}
            >
              <Icon aria-hidden="true" size={12} />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="dashboard-user">
          <span className="avatar avatar-user">JD</span>
          <span>
            <strong>John Doe</strong>
            <small>Online</small>
          </span>
        </div>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <h2>Dashboard</h2>
          <div>
            <Bell aria-label="Notifications" size={13} />
            <span className="avatar avatar-small">JD</span>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="dashboard-stat stat-blue">
            <div><strong>3</strong><span>Active Projects</span></div>
            <span className="stat-icon"><Folder size={16} /></span>
          </div>
          <div className="dashboard-stat stat-purple">
            <div><strong>5</strong><span>Clients</span></div>
            <span className="stat-icon"><UsersRound size={16} /></span>
          </div>
          <div className="dashboard-stat stat-green">
            <div><strong>12</strong><span>Deliverables</span></div>
            <span className="stat-icon"><Check size={17} /></span>
          </div>
        </div>

        <div className="dashboard-panels">
          <section className="dashboard-panel overview-panel">
            <div className="panel-heading">
              <h3>Project Overview</h3>
              <span>Last 30 days⌄</span>
            </div>
            <div className="overview-content">
              <div aria-label="75 percent on track" className="donut-chart">
                <span>75%</span>
              </div>
              <div className="chart-legend">
                <span><i className="legend-green" />On Track <b>75%</b></span>
                <span><i className="legend-orange" />At Risk <b>15%</b></span>
                <span><i className="legend-pink" />Overdue <b>10%</b></span>
              </div>
            </div>
          </section>

          <section className="dashboard-panel deadline-panel">
            <div className="panel-heading">
              <h3>Upcoming Deadlines</h3>
              <a href="#how-it-works">View all →</a>
            </div>
            <div className="deadline-list">
              {deadlines.map((deadline) => (
                <div className="deadline-item" key={deadline.title}>
                  <i className={`deadline-dot dot-${deadline.color}`} />
                  <span><strong>{deadline.title}</strong><small>{deadline.due}</small></span>
                  <CalendarDays aria-hidden="true" size={13} />
                </div>
              ))}
            </div>
          </section>
        </div>
        <div aria-hidden="true" className="dashboard-footer">
          <MoreHorizontal size={14} />
          <CircleHelp size={13} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPreview
