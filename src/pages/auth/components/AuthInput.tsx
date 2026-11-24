import type { ReactNode } from 'react'

interface AuthInputProps {
  id: string
  label: string
  name: string
  type?: 'text' | 'email'
  value: string
  placeholder: string
  icon: ReactNode
  error?: string
  autoComplete: string
  onChange: (value: string) => void
}

function AuthInput({
  id,
  label,
  name,
  type = 'text',
  value,
  placeholder,
  icon,
  error,
  autoComplete,
  onChange,
}: AuthInputProps) {
  const errorId = `${id}-error`

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <span aria-hidden="true" className="auth-input-icon">{icon}</span>
        <input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          className="auth-input"
          id={id}
          name={name}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required
          type={type}
          value={value}
        />
      </div>
      {error && <p className="auth-field-error" id={errorId}>{error}</p>}
    </div>
  )
}

export default AuthInput
