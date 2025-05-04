"use client"

import { Box, Grid, Button, CircularProgress } from "@mui/material"
import { useNavigate } from "react-router-dom"
import CountryCard from "./CountryCard" // Assuming you have this component

const CountryList = ({ countries, loading, limit = 8 }) => {
  const navigate = useNavigate()

  // Always limit to 8 countries on the home page
  const displayedCountries = countries.slice(0, limit)

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {displayedCountries.map((country) => (
          <Grid item xs={12} sm={6} md={3} key={country.cca3 || country.name.common}>
            <CountryCard country={country} />
          </Grid>
        ))}
      </Grid>

      {/* Only show the View More button if there are more than 8 countries */}
      {countries.length > limit && (
        <Box sx={{ display: "flex", justifyContent: "right", mt: 4,mb:2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/all-countries")}
            sx={{
              borderRadius: "30px",
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              px: 4,
            }}
          >
            View More
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default CountryList



