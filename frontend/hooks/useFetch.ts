import { useState, useEffect, useCallback, useRef } from 'react'
import { SafeAbortController } from '@/lib/abort-controller-utils'

interface UseFetchOptions extends RequestInit {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

interface UseFetchReturn<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  execute: () => Promise<T | null>
  cancel: () => void
}

export function useFetch<T = any>(
  url: string | null,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const {
    immediate = false,
    onSuccess,
    onError,
    ...fetchOptions
  } = options

  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const controllerRef = useRef<SafeAbortController | null>(null)

  const execute = useCallback(async (): Promise<T | null> => {
    if (!url) return null

    // Cancel previous request
    if (controllerRef.current) {
      controllerRef.current.abort('New request initiated')
    }

    // Create new controller
    controllerRef.current = new SafeAbortController()
    const signal = controllerRef.current.signal

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal,
      })

      if (signal.aborted) {
        return null
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (signal.aborted) {
        return null
      }

      setData(result)
      onSuccess?.(result)
      return result
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return null
      }
      
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      onError?.(error)
      return null
    } finally {
      if (!signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [url, fetchOptions, onSuccess, onError])

  const cancel = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort('Manual cancellation')
      setIsLoading(false)
    }
  }, [])

  // Auto-execute on mount if immediate is true
  useEffect(() => {
    if (immediate && url) {
      execute()
    }
  }, [immediate, execute])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort('Component unmounted')
      }
    }
  }, [])

  return { data, error, isLoading, execute, cancel }
} 