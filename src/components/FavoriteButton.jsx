"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { IconButton, Tooltip } from "@mui/material"
import { Favorite as FavoriteIcon } from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import { toggleFavorite, checkIsFavorite } from "../services/favoriteService"

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
    <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
      <IconButton
        onClick={handleToggleFavorite}
        disabled={isLoading}
        size="small"
        color={isFavorite ? "error" : "default"}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <FavoriteIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  )
}

export default FavoriteButton
