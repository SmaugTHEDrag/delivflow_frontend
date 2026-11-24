import {
  BarChart3,
  Check,
  ClipboardCheck,
  Folder,
  FolderKanban,
  LayoutDashboard,
  Rocket,
  UsersRound,
} from 'lucide-react'
import AuthLogo from './AuthLogo'

type AuthMode = 'login' | 'register'

interface AuthBrandPanelProps {
  mode: AuthMode
}

function LoginIllustration() {
  return (
    <div aria-hidden="true" className="auth-illustration login-illustration">
      <div className="illustration-orbit" />
      <div className="mini-leaf" />
      <div className="auth-mini-dashboard">
        <div className="mini-dashboard-head">
          <LayoutDashboard size={15} />
          <span>Workspace overview</span>
          <i />
        </div>
        <div className="mini-dashboard-content">
          <div className="mini-dashboard-list">
            <span><FolderKanban size={12} />Website redesign</span>
            <span><UsersRound size={12} />Client collaboration</span>
            <span><ClipboardCheck size={12} />Recent deliverables</span>
          </div>
          <div className="mini-dashboard-chart">
            <span>75%</span>
            <i />
          </div>
        </div>
      </div>
    </div>
  )
}

function RegisterIllustration() {
  return (
    <div aria-hidden="true" className="auth-illustration register-illustration">
      <div className="illustration-orbit" />
      <i className="rocket-star star-one" />
      <i className="rocket-star star-two" />
      <span className="rocket-orbit-icon orbit-check"><Check size={19} /></span>
      <span className="rocket-orbit-icon orbit-folder"><Folder size={19} /></span>
      <div className="auth-rocket"><Rocket size={82} /></div>
      <span className="rocket-orbit-icon orbit-chart"><BarChart3 size={19} /></span>
    </div>
  )
}

function AuthBrandPanel({ mode }: AuthBrandPanelProps) {
  const isLogin = mode === 'login'

  return (
    <section aria-label="DelivFlow" className="auth-brand-panel">
      <AuthLogo />
      <div className="auth-brand-copy">
        <h1>{isLogin ? 'Welcome Back!' : 'Get Started with DelivFlow'}</h1>
        <p>
          {isLogin
            ? 'Sign in to your account and continue organizing your projects.'
            : 'Create your account and bring your projects into focus.'}
        </p>
      </div>
      {isLogin ? <LoginIllustration /> : <RegisterIllustration />}
    </section>
  )
}

export default AuthBrandPanel
