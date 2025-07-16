import { useState, useEffect } from 'react'
import { blink } from '../blink/client'

interface AuthState {
  user: any | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setAuthState({
        user: state.user,
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated
      })
    })

    return unsubscribe
  }, [])

  const login = () => {
    blink.auth.login()
  }

  const logout = () => {
    blink.auth.logout()
  }

  return {
    ...authState,
    login,
    logout
  }
}