import { createContext, useContext, useState, useEffect } from "react"
import { loginUser, logoutUser, getCurrentUser } from "../services/authService"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const user = await loginUser(credentials)
      setUser(user)
      return user
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
      setUser(null)
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}
