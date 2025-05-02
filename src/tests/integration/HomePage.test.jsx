import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import HomePage from "../../pages/HomePage"
import { AuthProvider } from "../../contexts/AuthContext"
import { ToastProvider } from "../../contexts/ToastContext"
import * as api from "../../services/api"

// Mock the API service
jest.mock("../../services/api", () => ({
  getAllCountries: jest.fn(),
  getCountriesByName: jest.fn(),
  getCountriesByRegion: jest.fn(),
}))

// Mock the favorite service
jest.mock("../../services/favoriteService", () => ({
  checkIsFavorite: jest.fn(() => Promise.resolve(false)),
  toggleFavorite: jest.fn(() => Promise.resolve(true)),
}))

// Mock the useSearchParams hook
const mockSetSearchParams = jest.fn()
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: () => [
    {
      get: (param) => {
        if (param === "search") return ""
        if (param === "region") return ""
        if (param === "language") return ""
        return null
      },
      toString: () => "",
    },
    mockSetSearchParams,
  ],
}))

const mockCountries = [
  {
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
  },
  {
    name: {
      common: "France",
      official: "French Republic",
    },
    cca3: "FRA",
    flags: {
      svg: "https://flagcdn.com/fr.svg",
      png: "https://flagcdn.com/w320/fr.png",
      alt: "The flag of France",
    },
    capital: ["Paris"],
    region: "Europe",
    population: 67391582,
  },
]

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>{ui}</ToastProvider>
      </AuthProvider>
    </BrowserRouter>,
  )
}

describe("HomePage Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    api.getAllCountries.mockResolvedValue(mockCountries)
    api.getCountriesByName.mockResolvedValue([mockCountries[0]])
    api.getCountriesByRegion.mockResolvedValue(mockCountries)
  })

  test("fetches and displays countries", async () => {
    renderWithProviders(<HomePage />)

    // Wait for countries to load
    await waitFor(() => {
      expect(api.getAllCountries).toHaveBeenCalled()
    })

    // Check if country cards are displayed
    await waitFor(() => {
      expect(screen.getByText("Germany")).toBeInTheDocument()
      expect(screen.getByText("France")).toBeInTheDocument()
    })
  })

  test("filters countries by search", async () => {
    renderWithProviders(<HomePage />)

    // Wait for countries to load
    await waitFor(() => {
      expect(api.getAllCountries).toHaveBeenCalled()
    })

    // Find search input and type in it
    const searchInput = screen.getByPlaceholderText("Search for a country...")
    fireEvent.change(searchInput, { target: { value: "Germany" } })

    // Mock the search params to return the search query
    jest.spyOn(URLSearchParams.prototype, "get").mockImplementation((param) => {
      if (param === "search") return "Germany"
      return null
    })

    // Re-render with new search params
    // renderWithProviders(<HomePage />); // Removed this line as it's causing re-renders and incorrect test results

    // Wait for search results
    await waitFor(() => {
      expect(api.getCountriesByName).toHaveBeenCalledWith("Germany")
    })

    // Check if only Germany is displayed
    await waitFor(() => {
      expect(screen.getByText("Germany")).toBeInTheDocument()
      expect(screen.queryByText("France")).not.toBeInTheDocument()
    })
  })
})
