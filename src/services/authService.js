// This is a mock authentication service for demo purposes
// In a real application, this would connect to a backend API

// Simulate local storage for user data
const USER_STORAGE_KEY = "rest_countries_user"

// Get the current user from storage
export const getCurrentUser = async () => {
  const userJson = localStorage.getItem(USER_STORAGE_KEY)
  return userJson ? JSON.parse(userJson) : null
}

// Login a user
export const loginUser = async (credentials) => {
  // For demo purposes, accept any well-formed email and password
  if (!credentials.email) {
    throw new Error("Email is required")
  }

  // If this is an OAuth login (has name property) or password is valid
  if (credentials.name || (credentials.password && credentials.password.length >= 6)) {
    // Create a mock user object
    const user = {
      id: `user_${Date.now()}`,
      email: credentials.email,
      name: credentials.name || credentials.email.split("@")[0],
    }

    // Save to local storage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    return user
  }

  throw new Error("Invalid credentials")
}

// Logout the current user
export const logoutUser = async () => {
  localStorage.removeItem(USER_STORAGE_KEY)
  return true
}
