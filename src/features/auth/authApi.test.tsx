// @vitest-environment jsdom

import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AuthBootstrap from './AuthBootstrap'
import { authApi } from './authApi'
import authReducer, { setAccessToken, setCsrf } from './authSlice'
import { baseApi } from '@/services/api/baseApi'

const accessToken = (token: string) => ({
  success: true,
  message: 'ok',
  data: {
    accessToken: token,
    tokenType: 'Bearer',
    expiresIn: 3600,
    user: null,
  },
})

const profile = {
  sub: 'user-1',
  username: 'alex',
  email: 'alex@example.com',
  emailVerified: true,
  name: 'Alex Example',
  firstName: 'Alex',
  lastName: 'Example',
  avatarUrl: null,
}

type TestStore = ReturnType<typeof createTestStore>

function createTestStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  })
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function requestAt(index: number) {
  const [input, init] = fetchMock.mock.calls[index] ?? []
  return input instanceof Request
    ? input
    : new Request(input as RequestInfo, init)
}

let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>

beforeEach(() => {
  fetchMock = vi.fn<typeof fetch>(async () => jsonResponse({}))
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('auth API base query', () => {
  it('uses credentials and the server-provided CSRF header for logout', async () => {
    const store = createTestStore()
    store.dispatch(setCsrf({ token: 'csrf-value', headerName: 'X-SESSION-CSRF' }))
    fetchMock.mockResolvedValueOnce(jsonResponse({ success: true, message: 'ok', data: null }))

    await store.dispatch(authApi.endpoints.logout.initiate()).unwrap()

    expect(requestAt(0).credentials).toBe('include')
    expect(requestAt(0).headers.get('X-SESSION-CSRF')).toBe('csrf-value')
  })

  it('retrieves CSRF configuration and blocks refresh without a valid configuration', async () => {
    const store = createTestStore()
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ token: 'csrf-value', headerName: 'X-SESSION-CSRF' }),
    )

    await expect(
      store.dispatch(authApi.endpoints.getCsrf.initiate()).unwrap(),
    ).resolves.toEqual({ token: 'csrf-value', headerName: 'X-SESSION-CSRF' })
    await expect(
      store.dispatch(authApi.endpoints.refresh.initiate()).unwrap(),
    ).rejects.toBeDefined()

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('uses the current access token on protected API requests', async () => {
    const store = createTestStore()
    store.dispatch(setAccessToken({ accessToken: 'access-current', expiresIn: 300 }))
    fetchMock.mockResolvedValueOnce(jsonResponse(profile))

    await store.dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap()

    expect(requestAt(0).headers.get('Authorization')).toBe('Bearer access-current')
    expect(requestAt(0).credentials).toBe('include')
  })

  it('keeps login access tokens out of RTK Query result caches', async () => {
    const store = createTestStore()
    fetchMock.mockResolvedValueOnce(jsonResponse(accessToken('access-login')))

    await store.dispatch(
      authApi.endpoints.login.initiate({
        email: 'alex@example.com',
        password: 'StrongPass1',
      }),
    ).unwrap()

    expect(store.getState().auth.accessToken).toBe('access-login')
    expect(JSON.stringify(store.getState()[baseApi.reducerPath])).not.toContain(
      'access-login',
    )
  })

  it('shares one refresh across concurrent 401 responses and retries both requests', async () => {
    const protectedApi = baseApi.injectEndpoints({
      endpoints: (build) => ({
        firstProtected: build.query<string, void>({
          query: () => '/api/test/first',
        }),
        secondProtected: build.query<string, void>({
          query: () => '/api/test/second',
        }),
      }),
    })
    const store = createTestStore()
    store.dispatch(setAccessToken({ accessToken: 'access-old', expiresIn: 300 }))
    store.dispatch(setCsrf({ token: 'csrf-value', headerName: 'X-SESSION-CSRF' }))
    let refreshCalls = 0

    fetchMock.mockImplementation(async (input) => {
      const request = input instanceof Request ? input : new Request(input)
      const path = new URL(request.url).pathname
      if (path === '/api/auth/refresh') {
        refreshCalls += 1
        await new Promise((resolve) => setTimeout(resolve, 10))
        return jsonResponse(accessToken('access-new'))
      }
      if (request.headers.get('Authorization') === 'Bearer access-old') {
        return jsonResponse({ message: 'expired' }, 401)
      }
      return jsonResponse({ value: path })
    })

    const [first, second] = await Promise.all([
      store.dispatch(protectedApi.endpoints.firstProtected.initiate()).unwrap(),
      store.dispatch(protectedApi.endpoints.secondProtected.initiate()).unwrap(),
    ])

    expect(first).toEqual({ value: '/api/test/first' })
    expect(second).toEqual({ value: '/api/test/second' })
    expect(refreshCalls).toBe(1)
    expect(fetchMock).toHaveBeenCalledTimes(5)
    expect(requestAt(2).headers.get('X-SESSION-CSRF')).toBe('csrf-value')
    expect(requestAt(2).credentials).toBe('include')
    expect(requestAt(3).headers.get('Authorization')).toBe('Bearer access-new')
    expect(requestAt(4).headers.get('Authorization')).toBe('Bearer access-new')
  })

  it('does not refresh login or register failures and retries protected requests once', async () => {
    const store = createTestStore()
    store.dispatch(setAccessToken({ accessToken: 'access-old', expiresIn: 300 }))
    store.dispatch(setCsrf({ token: 'csrf-value', headerName: 'X-SESSION-CSRF' }))
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'invalid' }, 401))

    await expect(
      store.dispatch(
        authApi.endpoints.login.initiate({ email: 'a@example.com', password: 'bad' }),
      ).unwrap(),
    ).rejects.toBeDefined()
      fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'invalid' }, 401))
      await expect(
        store.dispatch(
          authApi.endpoints.register.initiate({
            username: 'alex',
            firstName: 'Alex',
            lastName: 'Example',
            email: 'a@example.com',
            password: 'invalid',
          }),
        ).unwrap(),
      ).rejects.toBeDefined()
      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(
        fetchMock.mock.calls.some(([input]) => {
          const request = input instanceof Request ? input : new Request(input)
          return new URL(request.url).pathname === '/api/auth/refresh'
        }),
      ).toBe(false)

    fetchMock.mockReset()
    fetchMock.mockImplementation(async (input) => {
      const request = input instanceof Request ? input : new Request(input)
      if (new URL(request.url).pathname === '/api/auth/refresh') {
        return jsonResponse(accessToken('access-new'))
      }
      return jsonResponse({ message: 'still unauthorized' }, 401)
    })
    const protectedApi = baseApi.injectEndpoints({
      endpoints: (build) => ({
        protectedAgain: build.query<unknown, void>({
          query: () => '/api/test/retry-once',
        }),
      }),
    })

    await expect(
      store.dispatch(protectedApi.endpoints.protectedAgain.initiate()).unwrap(),
    ).rejects.toBeDefined()
    const protectedCalls = fetchMock.mock.calls.filter(([input]) => {
      const request = input instanceof Request ? input : new Request(input)
      return new URL(request.url).pathname === '/api/test/retry-once'
    })
    expect(protectedCalls).toHaveLength(2)
    expect(store.getState().auth.status).toBe('unauthenticated')
  })

  it.each([
    [401, 'unauthenticated', null],
    [503, 'recoverable-error', 'access-old'],
  ] as const)(
    'handles refresh HTTP %i without losing recoverable sessions',
    async (status, expectedStatus, expectedToken) => {
      const protectedApi = baseApi.injectEndpoints({
        endpoints: (build) => ({
          protectedStatus: build.query<unknown, void>({
            query: () => '/api/test/status',
          }),
        }),
      })
      const store = createTestStore()
      store.dispatch(setAccessToken({ accessToken: 'access-old', expiresIn: 300 }))
      store.dispatch(setCsrf({ token: 'csrf-value', headerName: 'X-SESSION-CSRF' }))
      fetchMock.mockImplementation(async (input) => {
        const request = input instanceof Request ? input : new Request(input)
        return new URL(request.url).pathname === '/api/auth/refresh'
          ? jsonResponse({ message: 'refresh failed' }, status)
          : jsonResponse({ message: 'expired' }, 401)
      })

      await expect(
        store.dispatch(protectedApi.endpoints.protectedStatus.initiate()).unwrap(),
      ).rejects.toBeDefined()
      expect(store.getState().auth.status).toBe(expectedStatus)
      expect(store.getState().auth.accessToken).toBe(expectedToken)
    },
  )

  it('preserves session state when refresh fails due to a network error', async () => {
    const protectedApi = baseApi.injectEndpoints({
      endpoints: (build) => ({
        protectedOffline: build.query<unknown, void>({
          query: () => '/api/test/offline',
        }),
      }),
    })
    const store = createTestStore()
    store.dispatch(setAccessToken({ accessToken: 'access-old', expiresIn: 300 }))
    store.dispatch(setCsrf({ token: 'csrf-value', headerName: 'X-SESSION-CSRF' }))
    fetchMock.mockImplementation(async (input) => {
      const request = input instanceof Request ? input : new Request(input)
      if (new URL(request.url).pathname === '/api/auth/refresh') {
        throw new TypeError('Network unavailable')
      }
      return jsonResponse({ message: 'expired' }, 401)
    })

    await expect(
      store.dispatch(protectedApi.endpoints.protectedOffline.initiate()).unwrap(),
    ).rejects.toBeDefined()
    expect(store.getState().auth.status).toBe('recoverable-error')
    expect(store.getState().auth.accessToken).toBe('access-old')
  })
})

describe('auth bootstrap', () => {
  let root: Root
  let container: HTMLDivElement
  let store: TestStore

  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    store = createTestStore()
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
  })

  async function renderBootstrap() {
    await act(async () => {
      root.render(
        <StrictMode>
          <Provider store={store}>
            <AuthBootstrap>
              <main>Public page</main>
            </AuthBootstrap>
          </Provider>
        </StrictMode>,
      )
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
  }

  it('keeps public content rendered and restores the session once in StrictMode', async () => {
    fetchMock.mockImplementation(async (input) => {
      const request = input instanceof Request ? input : new Request(input)
      switch (new URL(request.url).pathname) {
        case '/api/auth/csrf':
          return jsonResponse({ token: 'csrf-value', headerName: 'X-SESSION-CSRF' })
        case '/api/auth/refresh':
          return jsonResponse(accessToken('access-restored'))
        default:
          return jsonResponse(profile)
      }
    })

    await renderBootstrap()

    expect(container.textContent).toContain('Public page')
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(store.getState().auth.status).toBe('authenticated')
    expect(store.getState().auth.accessToken).toBe('access-restored')
    expect(JSON.stringify(store.getState()[baseApi.reducerPath])).not.toContain(
      'access-restored',
    )
    expect(
      store.getState()[baseApi.reducerPath].queries['getCurrentUser(undefined)']?.data,
    ).toEqual(profile)
  })

  it.each([
    [401, 'unauthenticated'],
    [503, 'recoverable-error'],
  ] as const)(
    'initializes safely when refresh returns HTTP %i',
    async (status, expectedStatus) => {
      fetchMock.mockImplementation(async (input) => {
        const request = input instanceof Request ? input : new Request(input)
        return new URL(request.url).pathname === '/api/auth/csrf'
          ? jsonResponse({ token: 'csrf-value', headerName: 'X-SESSION-CSRF' })
          : jsonResponse({ message: 'refresh failed' }, status)
      })

      await renderBootstrap()

      expect(container.textContent).toContain('Public page')
      expect(store.getState().auth.status).toBe(expectedStatus)
      expect(fetchMock).toHaveBeenCalledTimes(2)
    },
  )

  it('keeps public pages available when CSRF bootstrap hits a network error', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network unavailable'))

    await renderBootstrap()

    expect(container.textContent).toContain('Public page')
    expect(store.getState().auth.status).toBe('recoverable-error')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
