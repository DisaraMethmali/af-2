"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Box, Typography, Button, Grid, CircularProgress } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import CountryCard from "../components/CountryCard"

const AllCountries = ({ countries, loading }) => {
  const navigate = useNavigate()

  // Optional: Add pagination if there are many countries
  const [page, setPage] = useState(1)
  const itemsPerPage = 20
  const totalPages = Math.ceil(countries.length / itemsPerPage)

  const displayedCountries = countries.slice(0, page * itemsPerPage)

  const loadMore = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, pr:6, fontFamily: "Poppins, sans-serif" }}>
<Box
  sx={{
    display: "flex",
    justifyContent: "center", // center everything horizontally
    alignItems: "center",
    mb: 4,
pl:4,
    position: "relative",
    flexDirection: "column", // stack button and title vertically
    textAlign: "center"
  }}
>
  <Button
    startIcon={<ArrowBack />}
    variant="contained"
    onClick={() => navigate("/")}
    sx={{
      borderRadius: "30px",
      textTransform: "none",
      fontFamily: "Poppins, sans-serif",
      alignSelf: "flex-start", // align button to the left of container
      mb: 2
    }}
  >
    Back to Home
  </Button>

  <Typography
    variant="h4"
    component="h1"
    fontWeight={600}
    sx={{
      fontFamily: "Poppins, sans-serif"
    }}
  >
    All Countries
  </Typography>
</Box>
<Box
  sx={{
    display: "flex",
    justifyContent: "center", // center everything horizontally
    alignItems: "center",
    mb: 4,
pl:5,
    position: "relative",
    flexDirection: "column", // stack button and title vertically
    textAlign: "center"
  }}
>
      <Grid container spacing={3}>
        {displayedCountries.map((country) => (
          <Grid item xs={12} sm={6} md={3} key={country.cca3 || country.name.common}>
            <CountryCard country={country} />
          </Grid>
        ))}
      </Grid>
</Box>
      {/* Load more button for pagination */}
      {page < totalPages && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={loadMore}
            sx={{
              borderRadius: "30px",
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              px: 6,
            }}
          >
            Load More Countries
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default AllCountries
