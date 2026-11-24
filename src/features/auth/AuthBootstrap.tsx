import { useEffect, useRef, type ReactNode } from 'react'
import { authApi } from './authApi'
import {
  isCsrfConfiguration,
  setCsrf,
  setRecoverableError,
  setUnauthenticated,
} from './authSlice'
import { useAppDispatch } from '@/app/hooks'

interface AuthBootstrapProps {
  children: ReactNode
}

function errorStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null || !('status' in error)) {
    return undefined
  }
  return typeof error.status === 'number' ? error.status : undefined
}

function AuthBootstrap({ children }: AuthBootstrapProps) {
  const dispatch = useAppDispatch()
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    dispatch(setCsrf(null))

    const restoreSession = async () => {
      try {
        const csrf = await dispatch(
          authApi.endpoints.getCsrf.initiate(undefined, { subscribe: false }),
        ).unwrap()
        if (!isCsrfConfiguration(csrf)) {
          dispatch(setRecoverableError())
          return
        }
        dispatch(setCsrf(csrf))

        await dispatch(
          authApi.endpoints.refresh.initiate(undefined),
        ).unwrap()
        await dispatch(
          authApi.endpoints.getCurrentUser.initiate(undefined, { subscribe: false }),
        ).unwrap()
      } catch (error) {
        if (errorStatus(error) === 401) {
          dispatch(setUnauthenticated())
        } else {
          dispatch(setRecoverableError())
        }
      }
    }

    void restoreSession()
  }, [dispatch])

  return children
}

export default AuthBootstrap
