import { render, screen, waitFor } from "@testing-library/react"
import { Routes, Route, MemoryRouter } from "react-router-dom"
import CountryDetailPage from "../../pages/CountryDetailPage"
import { AuthProvider } from "../../contexts/AuthContext"
import { ToastProvider } from "../../contexts/ToastContext"
import * as api from "../../services/api"

// Mock the API service
jest.mock("../../services/api", () => ({
  getCountryByCode: jest.fn(),
  getBorderCountries: jest.fn(),
}))

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
  subregion: "Western Europe",
  population: 83240525,
  borders: ["AUT", "BEL", "CZE", "DNK", "FRA", "LUX", "NLD", "POL", "CHE"],
  languages: { deu: "German" },
  currencies: { EUR: { name: "Euro", symbol: "€" } },
  tld: [".de"],
  area: 357114,
}

const mockBorderCountries = [
  {
    name: { common: "Austria" },
    cca3: "AUT",
  },
  {
    name: { common: "Belgium" },
    cca3: "BEL",
  },
]

const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <ToastProvider>{ui}</ToastProvider>
    </AuthProvider>,
  )
}

describe("CountryDetailPage Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    api.getCountryByCode.mockResolvedValue(mockCountry)
    api.getBorderCountries.mockResolvedValue(mockBorderCountries)
  })

  test("fetches and displays country details", async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={["/countries/DEU"]}>
        <Routes>
          <Route path="/countries/:code" element={<CountryDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    // Check if loading state is shown initially
    expect(screen.getByRole("main")).toBeInTheDocument()

    // Wait for data to load
    await waitFor(() => {
      expect(api.getCountryByCode).toHaveBeenCalledWith("DEU")
    })

    // Check if country name is displayed
    await waitFor(() => {
      expect(screen.getByText("Germany")).toBeInTheDocument()
    })

    // Check if population is displayed and formatted
    expect(screen.getByText("83,240,525")).toBeInTheDocument()

    // Check if flag is displayed
    const flagImage = screen.getByRole("img")
    expect(flagImage).toHaveAttribute("src", mockCountry.flags.svg)

    // Check if border countries are displayed
    expect(screen.getByText("Border Countries")).toBeInTheDocument()
    expect(screen.getByText("Austria")).toBeInTheDocument()
    expect(screen.getByText("Belgium")).toBeInTheDocument()
  })

  test("displays error message when country fetch fails", async () => {
    // Mock API error
    api.getCountryByCode.mockRejectedValue(new Error("Failed to fetch country"))

    renderWithProviders(
      <MemoryRouter initialEntries={["/countries/XXX"]}>
        <Routes>
          <Route path="/countries/:code" element={<CountryDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to load country details/)).toBeInTheDocument()
    })

    // Check if "Return to Home" link is displayed
    expect(screen.getByText("Return to Home")).toBeInTheDocument()
  })
})
