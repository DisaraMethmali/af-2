import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FaGithub, FaGoogle } from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"

const SignInPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { showToast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login({ email, password })
      showToast({
        title: "Welcome back!",
        message: "You have successfully signed in.",
      })
      navigate(from, { replace: true })
    } catch (error) {
      console.error("Login error:", error)
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (provider) => {
    // In a real app, this would redirect to the OAuth provider
    // For demo purposes, we'll simulate a successful login
    setIsLoading(true)
    setTimeout(() => {
      login({
        email: `demo@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      })
      showToast({
        title: "Welcome!",
        message: `You have successfully signed in with ${provider}.`,
      })
      navigate(from, { replace: true })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <div className="card w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-muted">Sign in to your account to save your favorite countries</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleOAuthSignIn("github")}
              disabled={isLoading}
              className="btn btn-outline flex items-center justify-center gap-2"
            >
              <FaGithub />
              GitHub
            </button>
            <button
              onClick={() => handleOAuthSignIn("google")}
              disabled={isLoading}
              className="btn btn-outline flex items-center justify-center gap-2"
            >
              <FaGoogle />
              Google
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
                />
              </div>

              {error && <div className="text-sm text-destructive text-center">{error}</div>}

              <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-sm text-muted mt-6">
          <p>For demo purposes, any email with a password of 6+ characters will work</p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
