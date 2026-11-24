import { baseApi } from '@/services/api/baseApi'
import type {
  AuthMutationResult,
  AuthResponse,
  CsrfResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
} from './authTypes'
import { isAuthTokenResponse } from './authTypes'
import {
  setAccessToken,
  setRecoverableError,
  setUnauthenticated,
} from './authSlice'

function authFailureStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null || !('status' in error)) {
    return undefined
  }
  return typeof error.status === 'number' ? error.status : undefined
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthMutationResult, LoginRequest>({
      async queryFn(body, api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: '/api/auth/login',
          method: 'POST',
          body,
        })
        if (result.error) return { error: result.error }
        if (!isAuthTokenResponse(result.data)) {
          api.dispatch(setRecoverableError())
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'The login response did not contain a valid access token.',
            },
          }
        }
        api.dispatch(setAccessToken(result.data.data))
        return {
          data: {
            success: result.data.success,
            message: result.data.message,
          },
        }
      },
    }),
    register: build.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: '/api/auth/register',
        method: 'POST',
        body,
      }),
    }),
    refresh: build.mutation<AuthMutationResult, void>({
      async queryFn(_arg, api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: '/api/auth/refresh',
          method: 'POST',
        })
        if (result.error) return { error: result.error }
        if (!isAuthTokenResponse(result.data)) {
          api.dispatch(setRecoverableError())
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'The refresh response did not contain a valid access token.',
            },
          }
        }
        api.dispatch(setAccessToken(result.data.data))
        return {
          data: {
            success: result.data.success,
            message: result.data.message,
          },
        }
      },
      async onQueryStarted(_request, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          if (authFailureStatus(error) === 401) {
            dispatch(setUnauthenticated())
            dispatch(baseApi.util.resetApiState())
          } else {
            dispatch(setRecoverableError())
          }
        }
      },
    }),
    logout: build.mutation<AuthResponse, void>({
      query: () => ({ url: '/api/auth/logout', method: 'POST' }),
      async onQueryStarted(_request, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(setUnauthenticated())
          dispatch(baseApi.util.resetApiState())
        } catch (error) {
          if (authFailureStatus(error) === 401) {
            dispatch(setUnauthenticated())
            dispatch(baseApi.util.resetApiState())
          } else {
            dispatch(setRecoverableError())
          }
        }
      },
    }),
    resendVerification: build.mutation<AuthResponse, { email: string }>({
      query: ({ email }) => ({
        url: '/api/auth/resend-verification',
        method: 'POST',
        params: { email },
      }),
    }),
    getCsrf: build.query<CsrfResponse, void>({
      query: () => '/api/auth/csrf',
    }),
    getCurrentUser: build.query<UserProfile, void>({
      query: () => '/api/me',
      providesTags: ['CurrentUser'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
  useResendVerificationMutation,
  useGetCsrfQuery,
  useGetCurrentUserQuery,
} = authApi
