import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface CsrfConfiguration {
  token: string
  headerName: string
}

export type AuthStatus =
  | 'initializing'
  | 'authenticated'
  | 'unauthenticated'
  | 'recoverable-error'

interface AuthState {
  accessToken: string | null
  expiresIn: number | null
  csrf: CsrfConfiguration | null
  status: AuthStatus
}

const initialState: AuthState = {
  accessToken: null,
  expiresIn: null,
  csrf: null,
  status: 'initializing',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(
      state,
      action: PayloadAction<{ accessToken: string; expiresIn: number }>,
    ) {
      state.accessToken = action.payload.accessToken
      state.expiresIn = action.payload.expiresIn
      state.status = 'authenticated'
    },
    setCsrf(state, action: PayloadAction<CsrfConfiguration | null>) {
      state.csrf = action.payload
    },
    setUnauthenticated(state) {
      state.accessToken = null
      state.expiresIn = null
      state.status = 'unauthenticated'
    },
    setRecoverableError(state) {
      state.status = 'recoverable-error'
    },
  },
})

export const {
  setAccessToken,
  setCsrf,
  setRecoverableError,
  setUnauthenticated,
} = authSlice.actions

export function isCsrfConfiguration(value: unknown): value is CsrfConfiguration {
  if (typeof value !== 'object' || value === null) return false

  const { token, headerName } = value as Record<string, unknown>
  return (
    typeof token === 'string' &&
    token.trim().length > 0 &&
    typeof headerName === 'string' &&
    /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(headerName)
  )
}

export default authSlice.reducer
