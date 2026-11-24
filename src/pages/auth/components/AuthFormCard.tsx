import { ArrowRight, Mail, UserRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthInput from './AuthInput'
import GoogleAuthButton from './GoogleAuthButton'
import PasswordInput from './PasswordInput'

type AuthMode = 'login' | 'register'
type FormField = 'fullName' | 'email' | 'password' | 'terms'
type FormErrors = Partial<Record<FormField, string>>

interface AuthFormCardProps {
  mode: AuthMode
}

function AuthFormCard({ mode }: AuthFormCardProps) {
  const isRegister = mode === 'register'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {}
    if (isRegister && !fullName.trim()) {
      nextErrors.fullName = 'Enter your full name.'
    }
    if (!email.trim()) {
      nextErrors.email = 'Enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!password) {
      nextErrors.password = 'Enter your password.'
    } else if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }
    if (isRegister && !acceptedTerms) {
      nextErrors.terms = 'Please accept the Terms of Service to continue.'
    }
    return nextErrors
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setFeedback('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsLoading(true)
    window.setTimeout(() => {
      setIsLoading(false)
      setFeedback('Authentication is not connected yet. Your information was not submitted.')
    }, 650)
  }

  const updateField = (field: FormField, value: string) => {
    if (field === 'fullName') setFullName(value)
    if (field === 'email') setEmail(value)
    if (field === 'password') setPassword(value)
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
    setFeedback('')
  }

  return (
    <section aria-labelledby="auth-form-title" className="auth-form-card">
      <div className="auth-form-heading">
        <h2 id="auth-form-title">{isRegister ? 'Create Account' : 'Sign In'}</h2>
        <p>
          {isRegister
            ? 'Start your free account in just a few steps.'
            : 'Enter your credentials to access your workspace.'}
        </p>
      </div>

      <GoogleAuthButton mode={mode} />
      <div aria-hidden="true" className="auth-divider"><span>or</span></div>

      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        {isRegister && (
          <AuthInput
            autoComplete="name"
            error={errors.fullName}
            icon={<UserRound size={17} />}
            id="auth-full-name"
            label="Full Name"
            name="name"
            onChange={(value) => updateField('fullName', value)}
            placeholder="Your full name"
            value={fullName}
          />
        )}

        <AuthInput
          autoComplete="email"
          error={errors.email}
          icon={<Mail size={17} />}
          id="auth-email"
          label="Email Address"
          name="email"
          onChange={(value) => updateField('email', value)}
          placeholder="you@company.com"
          type="email"
          value={email}
        />

        <PasswordInput
          error={errors.password}
          isRegister={isRegister}
          onChange={(value) => updateField('password', value)}
          value={password}
        />

        {isRegister ? (
          <div className="auth-terms-field">
            <label className="auth-checkbox-label">
              <input
                checked={acceptedTerms}
                onChange={(event) => {
                  setAcceptedTerms(event.target.checked)
                  setErrors((current) => ({ ...current, terms: undefined }))
                  setFeedback('')
                }}
                type="checkbox"
              />
              <span className="auth-legal">
                I agree to the <a href="#terms-of-service">Terms of Service</a> and{' '}
                <a href="#privacy-policy">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <p className="auth-field-error">{errors.terms}</p>}
          </div>
        ) : (
          <div className="auth-form-options">
            <label className="auth-checkbox-label">
              <input
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                type="checkbox"
              />
              Remember me
            </label>
            <button
              className="auth-forgot"
              onClick={() => setFeedback('Password recovery is not available yet.')}
              type="button"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button className="auth-submit" disabled={isLoading} type="submit">
          {isLoading ? 'Please wait…' : isRegister ? 'Create Account' : 'Sign In'}
          {!isLoading && <ArrowRight aria-hidden="true" size={17} />}
        </button>

        {feedback && (
          <p className="auth-feedback" role="status">{feedback}</p>
        )}
      </form>

      <p className="auth-switch">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}
        <Link to={isRegister ? '/login' : '/register'}>
          {isRegister ? 'Sign In' : 'Register'}
        </Link>
      </p>
    </section>
  )
}

export default AuthFormCard
