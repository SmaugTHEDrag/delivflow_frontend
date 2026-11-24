import {
  createApi,
  fetchBaseQuery,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
  type BaseQueryApi,
  type QueryReturnValue,
} from '@reduxjs/toolkit/query/react'
import {
  isCsrfConfiguration,
  setAccessToken,
  setRecoverableError,
  setUnauthenticated,
} from '@/features/auth/authSlice'
import { isAuthTokenResponse } from '@/features/auth/authTypes'

type ApiState = {
  auth: {
    accessToken: string | null
    csrf: { token: string; headerName: string } | null
  }
}

type BaseQueryResult = QueryReturnValue<
  unknown,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>

const excludedAuthPaths = new Set([
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/api/auth/csrf',
  '/api/auth/resend-verification',
])

function requestUrl(args: string | FetchArgs) {
  return (typeof args === 'string' ? args : args.url).split('?')[0]
}

function authState(state: unknown) {
  return (state as ApiState).auth
}

function customError(error: string): FetchBaseQueryError {
  return { status: 'CUSTOM_ERROR', error }
}

function clearSession(api: Pick<BaseQueryApi, 'dispatch'>) {
  api.dispatch(setUnauthenticated())
  api.dispatch(baseApi.util.resetApiState())
}

async function retryOnce(
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: Parameters<typeof rawBaseQuery>[2],
  tokenUsed: string,
): Promise<BaseQueryResult> {
  const retry = await rawBaseQuery(args, api, extraOptions)
  if (retry.error?.status === 401 && authState(api.getState()).accessToken === tokenUsed) {
    clearSession(api)
  }
  return retry
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  credentials: 'include',
  prepareHeaders: (headers, { arg, getState }) => {
    const url = requestUrl(arg)
    const auth = authState(getState())

    if (!excludedAuthPaths.has(url) && auth.accessToken) {
      headers.set('Authorization', 'Bearer ' + auth.accessToken)
    }

    if (url === '/api/auth/refresh' || url === '/api/auth/logout') {
      if (isCsrfConfiguration(auth.csrf)) {
        headers.set(auth.csrf.headerName, auth.csrf.token)
      }
    }

    return headers
  },
})

let refreshPromise: Promise<BaseQueryResult> | null = null

const baseQueryWithRefresh = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: Parameters<typeof rawBaseQuery>[2],
): Promise<BaseQueryResult> => {
  const url = requestUrl(args)
  const auth = authState(api.getState())

  if (
    (url === '/api/auth/refresh' || url === '/api/auth/logout') &&
    !isCsrfConfiguration(auth.csrf)
  ) {
    return { error: customError('A valid CSRF configuration is required.') }
  }

  const originalToken = auth.accessToken
  const result = await rawBaseQuery(args, api, extraOptions)
  if (result.error?.status !== 401 || excludedAuthPaths.has(url)) {
    return result
  }

  const latestToken = authState(api.getState()).accessToken
  if (latestToken !== originalToken) {
    return latestToken
      ? retryOnce(args, api, extraOptions, latestToken)
      : result
  }

  if (!refreshPromise) {
    refreshPromise = Promise.resolve(rawBaseQuery(
      { url: '/api/auth/refresh', method: 'POST' },
      api,
      extraOptions,
    ))
  }

  const pendingRefresh = refreshPromise
  const refreshResult = await pendingRefresh
  if (refreshPromise === pendingRefresh) refreshPromise = null

  const tokenAfterRefresh = authState(api.getState()).accessToken
  if (tokenAfterRefresh !== originalToken) {
    return tokenAfterRefresh
      ? retryOnce(args, api, extraOptions, tokenAfterRefresh)
      : result
  }

  if (refreshResult.error) {
    if (refreshResult.error.status === 401) {
      clearSession(api)
    } else {
      api.dispatch(setRecoverableError())
    }
    return refreshResult
  }

  if (!isAuthTokenResponse(refreshResult.data)) {
    api.dispatch(setRecoverableError())
    return { error: customError('The refresh response did not contain a valid access token.') }
  }

  api.dispatch(setAccessToken(refreshResult.data.data))
  return retryOnce(
    args,
    api,
    extraOptions,
    refreshResult.data.data.accessToken,
  )
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['CurrentUser'],
  endpoints: () => ({}),
})
