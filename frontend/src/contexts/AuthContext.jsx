import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Token storage keys - shared across all Shizuha apps
const ACCESS_TOKEN_KEY = 'shizuha_access_token'
const USER_KEY = 'shizuha_user'

/**
 * Read-only AuthProvider for shizuha-home
 * Only reads auth state from localStorage - does not perform login/logout
 * Login/logout is handled by shizuha-id
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
      const storedUser = localStorage.getItem(USER_KEY)

      if (accessToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Failed to parse stored user:', error)
          setUser(null)
          setIsAuthenticated(false)
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === ACCESS_TOKEN_KEY || e.key === USER_KEY) {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
        const storedUser = localStorage.getItem(USER_KEY)

        if (accessToken && storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            setUser(userData)
            setIsAuthenticated(true)
          } catch {
            setUser(null)
            setIsAuthenticated(false)
          }
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
