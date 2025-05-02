
import { useState, useEffect } from "react"
import { useParams, Link as RouterLink } from "react-router-dom"
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
  Alert
} from "@mui/material"
import {
  ArrowBack as ArrowBackIcon,
  Public as PublicIcon,
  People as PeopleIcon,
  LocationOn as LocationOnIcon,
  Translate as TranslateIcon
} from "@mui/icons-material"
import { getCountryByCode, getBorderCountries } from "../services/api"
import FavoriteButton from "../components/FavoriteButton"

const CountryDetailPage = () => {
  const { code } = useParams()
  const [country, setCountry] = useState(null)
  const [borderCountries, setBorderCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCountryData = async () => {
      setLoading(true)
      try {
        const countryData = await getCountryByCode(code)
        setCountry(countryData)

        if (countryData.borders && countryData.borders.length > 0) {
          const borders = await getBorderCountries(countryData.borders)
          setBorderCountries(borders)
        }
      } catch (err) {
        console.error("Error fetching country:", err)
        setError("Failed to load country details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCountryData()
  }, [code])

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error || !country) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Country not found"}
        </Alert>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
        >
          Return to Home
        </Button>
      </Container>
    )
  }

  // Format population with commas
  const formattedPopulation = new Intl.NumberFormat().format(country.population)

  // Get languages as an array
  const languages = country.languages ? Object.values(country.languages) : []

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          color="inherit"
          sx={{ mb: 2 }}
        >
          Back to All Countries
        </Button>
      </Box>

      <Card elevation={3}>
        {/* Flag Section */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="300"
            image={country.flags.svg || country.flags.png}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            sx={{ 
              objectFit: 'contain', 
              bgcolor: 'grey.100'
            }}
          />
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <FavoriteButton country={country} />
          </Box>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Country Name and Official Name */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold"fontFamily= "Poppins, sans-serif">
              {country.name.common}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" fontFamily= "Poppins, sans-serif">
              {country.name.official}
            </Typography>
          </Box>

          {/* Key Stats */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { icon: <PublicIcon />, label: 'Region', value: country.region },
              { icon: <PeopleIcon />, label: 'Population', value: formattedPopulation },
              { icon: <LocationOnIcon />, label: 'Capital', value: country.capital?.[0] || 'N/A' },
              { icon: <TranslateIcon />, label: 'Languages', value: languages.length || 'N/A' }
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <Box sx={{ color: 'primary.main', mb: 1 }}>{stat.icon}</Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {stat.label}
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {stat.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Detailed Information */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* Geography Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
                Geography
              </Typography>
              <TableContainer component={Paper} elevation={0} variant="outlined">
                <Table>
                  <TableBody>
                    {[
                      { label: 'Region', value: country.region },
                      { label: 'Sub Region', value: country.subregion || 'N/A' },
                      { label: 'Capital', value: country.capital?.[0] || 'N/A' },
                      { 
                        label: 'Area', 
                        value: country.area ? `${new Intl.NumberFormat().format(country.area)} km²` : 'N/A' 
                      }
                    ].map((item, index) => (
                      <TableRow key={index}>
                        <TableCell 
                          component="th" 
                          scope="row"
                          sx={{ fontWeight: 'medium', bgcolor: 'grey.100', width: '40%' }}
                        >
                          {item.label}
                        </TableCell>
                        <TableCell>{item.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Additional Info Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
                Additional Info
              </Typography>
              <TableContainer component={Paper} elevation={0} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ fontWeight: 'medium', bgcolor: 'grey.100', width: '40%' }}
                      >
                        Top Level Domain
                      </TableCell>
                      <TableCell>{country.tld?.[0] || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ fontWeight: 'medium', bgcolor: 'grey.100' }}
                      >
                        Currencies
                      </TableCell>
                      <TableCell>
                        {country.currencies
                          ? Object.values(country.currencies)
                              .map((currency) => `${currency.name} (${currency.symbol})`)
                              .join(", ")
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ fontWeight: 'medium', bgcolor: 'grey.100' }}
                      >
                        Languages
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {languages.length > 0
                            ? languages.map((language) => (
                                <Chip
                                  key={language}
                                  label={language}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ))
                            : "N/A"}
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          {/* Border Countries */}
          {borderCountries.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
                Border Countries
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {borderCountries.map((border) => (
                  <Button
                    key={border.cca3}
                    component={RouterLink}
                    to={`/countries/${border.cca3}`}
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none' }}
                  >
                    {border.name.common}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

export default CountryDetailPage





