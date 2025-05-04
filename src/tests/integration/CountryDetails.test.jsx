import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import CountryDetailPage from '../../pages/CountryDetailPage';
import * as api from '../../services/api';
import '@testing-library/jest-dom';
// Mock the API service
jest.mock('../../services/api');

// Mock the FavoriteButton component
jest.mock('../../components/FavoriteButton', () => {
  return function MockFavoriteButton({ country }) {
    return <button data-testid="favorite-button">Favorite</button>;
  };
});

// Create localStorage mock
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    getAll: () => store
  };
})();

// Replace the global localStorage with our mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Sample country data
const mockCountry = {
  name: { common: 'Germany', official: 'Federal Republic of Germany' },
  cca3: 'DEU',
  capital: ['Berlin'],
  region: 'Europe',
  subregion: 'Western Europe',
  languages: { deu: 'German' },
  currencies: { EUR: { name: 'Euro', symbol: '€' } },
  flags: { svg: 'https://example.com/germany.svg', png: 'https://example.com/germany.png' },
  population: 83240525,
  borders: ['FRA', 'POL', 'CZE', 'AUT', 'CHE', 'LUX', 'BEL', 'NLD', 'DNK'],
  timezones: ['UTC+01:00'],
  tld: ['.de'],
  altSpellings: ['DE', 'Federal Republic of Germany', 'Bundesrepublik Deutschland']
};

// Sample border countries data
const mockBorderCountries = [
  {
    name: { common: 'France', official: 'French Republic' },
    cca3: 'FRA'
  },
  {
    name: { common: 'Poland', official: 'Republic of Poland' },
    cca3: 'POL'
  },
  {
    name: { common: 'Czech Republic', official: 'Czech Republic' },
    cca3: 'CZE'
  }
];

const renderWithRouter = (ui, { route = '/countries/DEU' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/countries/:code" element={ui} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('CountryDetailPage Integration Tests', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Setup API mock responses
    api.getCountryByCode.mockResolvedValue(mockCountry);
    api.getBorderCountries.mockResolvedValue(mockBorderCountries);
  });

  test('renders loading state initially', () => {
    renderWithRouter(<CountryDetailPage />);
    
    expect(screen.getByText('Loading country information...')).toBeInTheDocument();
  });

  test('renders country details after successful API call', async () => {
    renderWithRouter(<CountryDetailPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading country information...')).not.toBeInTheDocument();
    });
    
    // Check if country name is displayed
    expect(screen.getByText('Germany')).toBeInTheDocument();
    
    // Check if flag is displayed
    const flagImage = screen.getByAltText('Flag of Germany');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).toHaveAttribute('src', 'https://example.com/germany.svg');
    
    // Check if basic information is displayed
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('Western Europe')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    expect(screen.getByText('83,240,525')).toBeInTheDocument();
    expect(screen.getByText('German')).toBeInTheDocument();
    expect(screen.getByText('Euro')).toBeInTheDocument();
  });

  
  test('renders error state when API call fails', async () => {
    // Mock API to throw an error
    api.getCountryByCode.mockRejectedValue(new Error('API Error'));
    
    renderWithRouter(<CountryDetailPage />);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to load country details. Please try again later.')).toBeInTheDocument();
    });
    
    // Check if return to home button is displayed
    expect(screen.getByText('Return to Home')).toBeInTheDocument();
  });

  test('handles country with no border countries', async () => {
    // Mock country with no borders
    const islandCountry = { ...mockCountry, borders: [] };
    api.getCountryByCode.mockResolvedValue(islandCountry);
    
    renderWithRouter(<CountryDetailPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading country information...')).not.toBeInTheDocument();
    });
    
    // Check that the border countries section is not displayed
    expect(screen.queryByText('Neighbouring Countries')).not.toBeInTheDocument();
  });

  test('handles missing data gracefully', async () => {
    // Mock country with missing data
    const incompleteCountry = {
      name: { common: 'Incomplete Country' },
      cca3: 'INC',
      flags: { png: 'https://example.com/incomplete.png' }
      // Missing other fields
    };
    api.getCountryByCode.mockResolvedValue(incompleteCountry);
    
    renderWithRouter(<CountryDetailPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading country information...')).not.toBeInTheDocument();
    });
    
    // Check if country name is displayed
    expect(screen.getByText('Incomplete Country')).toBeInTheDocument();
    
    // Check if N/A is displayed for missing fields
    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThan(0);
  });

  test('favorite button functionality works correctly', async () => {
    renderWithRouter(<CountryDetailPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading country information...')).not.toBeInTheDocument();
    });
    
    // Check if favorite button is displayed
    expect(screen.getByTestId('favorite-button')).toBeInTheDocument();
  });

  test('navigation back to home works', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CountryDetailPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading country information...')).not.toBeInTheDocument();
    });
    
    // Click back button
    await user.click(screen.getByText('Back to all countries'));
    
    // Check if navigated to home page
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});