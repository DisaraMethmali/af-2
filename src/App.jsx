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


function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="app">
            <link
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap"
  rel="stylesheet"
/>
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
