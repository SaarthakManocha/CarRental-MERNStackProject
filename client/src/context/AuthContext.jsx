import { createContext, useEffect, useMemo, useState } from 'react'

import { getCurrentUser, loginUser, registerUser } from '../api/authApi'
import { clearStoredToken, getStoredToken, setStoredToken } from '../api/axios'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadProfile = async () => {
    const token = getStoredToken()
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const response = await getCurrentUser()
      setUser(response.user)
    } catch (error) {
      clearStoredToken()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const login = async (payload) => {
    const response = await loginUser(payload)
    setStoredToken(response.token)
    setUser(response.user)
    return response
  }

  const register = async (payload) => {
    const response = await registerUser(payload)
    setStoredToken(response.token)
    setUser(response.user)
    return response
  }

  const logout = () => {
    clearStoredToken()
    setUser(null)
  }

  const hasRole = (roles) => {
    if (!user) return false
    if (!roles || roles.length === 0) return true
    return roles.includes(user.role)
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      refreshProfile: loadProfile,
      hasRole,
      isAuthenticated: Boolean(user),
    }),
    [user, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
