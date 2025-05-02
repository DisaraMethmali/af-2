// API functions to interact with the REST Countries API

// Get all countries
export async function getAllCountries() {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all")
  
      if (!response.ok) {
        throw new Error("Failed to fetch countries")
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching all countries:", error)
      throw error
    }
  }
  
  // Search countries by name
  export async function getCountriesByName(name) {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${name}`)
  
      if (response.status === 404) {
        return []
      }
  
      if (!response.ok) {
        throw new Error("Failed to fetch countries by name")
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching countries by name "${name}":`, error)
      return []
    }
  }
  
  // Get countries by region
  export async function getCountriesByRegion(region) {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/region/${region}`)
  
      if (response.status === 404) {
        return []
      }
  
      if (!response.ok) {
        throw new Error("Failed to fetch countries by region")
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching countries by region "${region}":`, error)
      return []
    }
  }
  
  // Get country by code
  export async function getCountryByCode(code) {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
  
      if (!response.ok) {
        throw new Error("Failed to fetch country by code")
      }
  
      const data = await response.json()
      return data[0]
    } catch (error) {
      console.error(`Error fetching country by code "${code}":`, error)
      throw error
    }
  }
  
  // Get border countries
  export async function getBorderCountries(borderCodes) {
    if (!borderCodes.length) return []
  
    try {
      const codes = borderCodes.join(",")
      const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes}`)
  
      if (!response.ok) {
        throw new Error("Failed to fetch border countries")
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching border countries:", error)
      return []
    }
  }
  