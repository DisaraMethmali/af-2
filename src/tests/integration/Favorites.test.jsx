import { render, screen, waitFor } from "@testing-library/react"
import { Routes, Route, MemoryRouter } from "react-router-dom"
import FavoritesPage from "../../pages/FavoritesPage"
import { AuthProvider } from "../../contexts/AuthContext"
import { ToastProvider } from "../../contexts/ToastContext"
import * as favoriteService from "../../services/favoriteService"

// Mock the favorite service
jest.mock("../../services/favoriteService", () => ({
  getFavoriteCountries: jest.fn(),
  checkIsFavorite: jest.fn(() => Promise.resolve(true)),
  toggleFavorite: jest.fn(() => Promise.resolve(false)),
}))

// Mock the auth context
jest.mock("../../contexts/AuthContext", () => ({
  ...jest.requireActual("../../contexts/AuthContext"),
  useAuth: () => ({
    user: { id: "test-user-id", name: "Test User" },
    loading: false,
  }),
}))

const mockFavoriteCountries = [
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
      common: "Japan",
      official: "Japan",
    },
    cca3: "JPN",
    flags: {
      svg: "https://flagcdn.com/jp.svg",
      png: "https://flagcdn.com/w320/jp.png",
      alt: "The flag of Japan",
    },
    capital: ["Tokyo"],
    region: "Asia",
    population: 125836021,
  },
]

const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <ToastProvider>{ui}</ToastProvider>
    </AuthProvider>,
  )
}

describe("FavoritesPage Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    favoriteService.getFavoriteCountries.mockResolvedValue(mockFavoriteCountries)
  })

  test("fetches and displays favorite countries", async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={["/favorites"]}>
        <Routes>
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </MemoryRouter>,
    )

    // Wait for favorites to load
    await waitFor(() => {
      expect(favoriteService.getFavoriteCountries).toHaveBeenCalled()
    })

    // Check if favorite countries are displayed
    await waitFor(() => {
      expect(screen.getByText("Germany")).toBeInTheDocument()
      expect(screen.getByText("Japan")).toBeInTheDocument()
    })
  })

  test("displays message when no favorites exist", async () => {
    // Mock empty favorites
    favoriteService.getFavoriteCountries.mockResolvedValue([])

    renderWithProviders(
      <MemoryRouter initialEntries={["/favorites"]}>
        <Routes>
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </MemoryRouter>,
    )

    // Wait for favorites to load
    await waitFor(() => {
      expect(favoriteService.getFavoriteCountries).toHaveBeenCalled()
    })

    // Check if empty message is displayed
    await waitFor(() => {
      expect(screen.getByText(/You haven't added any countries to your favorites yet/)).toBeInTheDocument()
    })

    // Check if "Explore Countries" link is displayed
    expect(screen.getByText("Explore Countries")).toBeInTheDocument()
  })
})
