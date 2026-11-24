import { Link } from 'react-router-dom'

function AuthLogo() {
  return (
    <Link aria-label="DelivFlow home" className="auth-logo" to="/">
      <span aria-hidden="true" className="auth-logo-mark"><span /></span>
      <span>DelivFlow</span>
    </Link>
  )
}

export default AuthLogo
