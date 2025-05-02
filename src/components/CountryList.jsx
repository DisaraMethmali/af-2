import { Grid, Box, Typography } from "@mui/material"
import CountryCard from "./CountryCard"
import CountryListSkeleton from "./CountryListSkeleton"

const CountryList = ({ countries, loading }) => {
  if (loading) {
    return <CountryListSkeleton />
  }

  if (countries.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="h6" color="text.secondary">
          No countries found matching your criteria.
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {countries.map((country) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={country.cca3}>
          <CountryCard country={country} />
        </Grid>
      ))}
    </Grid>
  )
}

export default CountryList

