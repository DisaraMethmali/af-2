// This is a mock favorites service for demo purposes
// In a real application, this would connect to a backend API

import { getCountryByCode } from "./api"

// Simulate local storage for favorites
const FAVORITES_STORAGE_KEY = "rest_countries_favorites"

// Get all favorite country codes
const getFavoriteIds = () => {
  const favoritesJson = localStorage.getItem(FAVORITES_STORAGE_KEY)
  return favoritesJson ? JSON.parse(favoritesJson) : []
}

// Save favorite country codes
const saveFavoriteIds = (favoriteIds) => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
}

// Check if a country is a favorite
export const checkIsFavorite = async (countryCode) => {
  const favoriteIds = getFavoriteIds()
  return favoriteIds.includes(countryCode)
}

// Toggle a country's favorite status
export const toggleFavorite = async (countryCode, addToFavorites) => {
  let favoriteIds = getFavoriteIds()

  if (addToFavorites) {
    // Add to favorites if not already there
    if (!favoriteIds.includes(countryCode)) {
      favoriteIds.push(countryCode)
    }
  } else {
    // Remove from favorites
    favoriteIds = favoriteIds.filter((id) => id !== countryCode)
  }

  saveFavoriteIds(favoriteIds)
  return addToFavorites
}

// Get all favorite countries with details
export const getFavoriteCountries = async () => {
  const favoriteIds = getFavoriteIds()

  if (!favoriteIds.length) return []

  // Fetch the country details for each favorite
  const countriesPromises = favoriteIds.map((code) => getCountryByCode(code))

  const countries = await Promise.all(
    countriesPromises.map((promise) =>
      promise.catch((error) => {
        console.error("Error fetching favorite country:", error)
        return null
      })
    )
  )

  // Filter out any null values from failed requests
  return countries.filter(Boolean)
}
