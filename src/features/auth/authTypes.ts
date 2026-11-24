export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthUser {
  id: string | null
  keycloakId: string | null
  username: string | null
  email: string | null
  fullName: string | null
  firstName: string | null
  lastName: string | null
  emailVerified: boolean
  status: string | null
}

export interface AuthTokenResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    tokenType: string
    expiresIn: number
    user: AuthUser | null
  }
}

export interface AuthMutationResult {
  success: boolean
  message: string
}

export interface AuthResponse<T = unknown> {
  success: boolean
  message: string
  data: T | null
}

export interface UserProfile {
  sub: string | null
  username: string | null
  email: string | null
  emailVerified: boolean | null
  name: string | null
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
}

export interface CsrfResponse {
  token: string
  headerName: string
}

export function isAuthTokenResponse(value: unknown): value is AuthTokenResponse {
  if (typeof value !== 'object' || value === null) return false
  const data = (value as { data?: unknown }).data
  if (typeof data !== 'object' || data === null) return false
  const tokenData = data as Record<string, unknown>
  return (
    typeof tokenData.accessToken === 'string' &&
    tokenData.accessToken.length > 0 &&
    typeof tokenData.expiresIn === 'number' &&
    Number.isFinite(tokenData.expiresIn)
  )
}
