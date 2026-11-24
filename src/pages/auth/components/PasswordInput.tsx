import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useState } from 'react'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  isRegister: boolean
}

function PasswordInput({ value, onChange, error, isRegister }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const errorId = 'auth-password-error'

  return (
    <div className="auth-field">
      <label htmlFor="auth-password">Password</label>
      <div className="auth-input-wrap">
        <span aria-hidden="true" className="auth-input-icon">
          <LockKeyhole size={17} />
        </span>
        <input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          className="auth-input auth-password-input"
          id="auth-password"
          name="password"
          onChange={(event) => onChange(event.target.value)}
          placeholder={isRegister ? 'Create a password' : 'Enter your password'}
          required
          type={isVisible ? 'text' : 'password'}
          value={value}
        />
        <button
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          className="auth-password-toggle"
          onClick={() => setIsVisible((visible) => !visible)}
          type="button"
        >
          {isVisible ? <EyeOff aria-hidden="true" size={17} /> : <Eye aria-hidden="true" size={17} />}
        </button>
      </div>
      {error && <p className="auth-field-error" id={errorId}>{error}</p>}
    </div>
  )
}

export default PasswordInput
