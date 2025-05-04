import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./contexts/ToastContext"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import CountryDetailPage from "./pages/CountryDetailPage"
import FavoritesPage from "./pages/FavoritesPage"
import SignInPage from "./pages/SignInPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"
import AllCountries from "./pages/AllCountries";
import { getAllCountries } from "./services/api"
import { useState, useEffect } from "react"
function App() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllCountries = async () => {
      try {
        const data = await getAllCountries()
        setCountries(data)
      } catch (error) {
        console.error("Error fetching countries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllCountries()
  }, [])
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="app">

              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/countries/:code" element={<CountryDetailPage />} />
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  }
                />
                   <Route path="/all-countries" element={<AllCountries countries={countries} loading={loading} />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
