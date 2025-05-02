"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { IconButton, Tooltip, ThemeProvider, createTheme } from "@mui/material"
import { Favorite as FavoriteIcon } from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import { toggleFavorite, checkIsFavorite } from "../services/favoriteService"

// Create a custom theme with Poppins font
const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
  palette: {
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'white',
          color: '#333',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
          fontFamily: '"Poppins", sans-serif',
          fontSize: '0.8rem',
          border: '1px solid #e0e0e0',
        },
      },
    },
  },
});

const FavoriteButton = ({ country }) => {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      const fetchFavoriteStatus = async () => {
        const status = await checkIsFavorite(country.cca3)
        setIsFavorite(status)
      }
      fetchFavoriteStatus()
    }
  }, [user, country.cca3])

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate("/signin")
      return
    }
    
    setIsLoading(true)
    
    try {
      const newStatus = await toggleFavorite(country.cca3, !isFavorite)
      setIsFavorite(newStatus)
      
      showToast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        message: isFavorite
          ? `${country.name.common} has been removed from your favorites.`
          : `${country.name.common} has been added to your favorites.`,
      })
      
    } catch (error) {
      console.error("Error toggling favorite:", error)
      showToast({
        title: "Error",
        message: "Failed to update favorites. Please try again later.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
        <IconButton
          onClick={handleToggleFavorite}
          disabled={isLoading}
          size="small"
          color={isFavorite ? "error" : "default"}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          sx={{
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            boxShadow: '0px 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <FavoriteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ThemeProvider>
  )
}

export default FavoriteButton