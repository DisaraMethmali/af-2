import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import CountryCard from "../../components/CountryCard"
import Header from "../../components/Header"
import { AuthProvider } from "../../contexts/AuthContext"
import { ToastProvider } from "../../contexts/ToastContext"

// Mock the favorite service
jest.mock("../../services/favoriteService", () => ({
  checkIsFavorite: jest.fn(() => Promise.resolve(false)),
  toggleFavorite: jest.fn(() => Promise.resolve(true)),
}))

const mockCountry = {
  name: {
    common: "Germany",
    official: "Federal Republic of Germany",
  },
  cca3: "DEU",
  flags: {
    svg: "https://flagcdn.com/de.svg",
    png: "https://flagcdn.com/w320/de.png",
    alt: "The flag of Germany",
  },
  capital: ["Berlin"],
  region: "Europe",
  population: 83240525,
}

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>{ui}</ToastProvider>
      </AuthProvider>
    </BrowserRouter>,
  )
}

describe("Responsive Design Tests", () => {
  // Test for mobile viewport
  test("Header adapts to mobile viewport", () => {
    // Set viewport to mobile size
    global.innerWidth = 375
    global.dispatchEvent(new Event("resize"))

    renderWithProviders(<Header />)

    // In mobile view, user name should be hidden
    const userNameElement = screen.queryByText("Test User")
    expect(userNameElement).not.toBeInTheDocument()
  })

  // Test for tablet viewport
  test("CountryCard maintains readability on tablet", () => {
    // Set viewport to tablet size
    global.innerWidth = 768
    global.dispatchEvent(new Event("resize"))

    renderWithProviders(<CountryCard country={mockCountry} />)

    // Check if country name is still visible and readable
    const countryName = screen.getByText("Germany")
    expect(countryName).toBeInTheDocument()

    // Check computed styles for readability
    const styles = window.getComputedStyle(countryName)
    expect(Number.parseInt(styles.fontSize)).toBeGreaterThanOrEqual(16) // Ensure text is readable
  })

  // Test for desktop viewport
  test("CountryCard displays properly on desktop", () => {
    // Set viewport to desktop size
    global.innerWidth = 1200
    global.dispatchEvent(new Event("resize"))

    renderWithProviders(<CountryCard country={mockCountry} />)

    // Check if all elements are visible
    expect(screen.getByText("Germany")).toBeInTheDocument()
    expect(screen.getByText(/83,240,525/)).toBeInTheDocument()
    expect(screen.getByText(/Europe/)).toBeInTheDocument()
    expect(screen.getByText(/Berlin/)).toBeInTheDocument()
    expect(screen.getByText("View details")).toBeInTheDocument()
  })
})
