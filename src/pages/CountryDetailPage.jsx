import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CardMedia,
  Alert,
  CssBaseline,
  AppBar,
  Toolbar,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LanguageIcon from '@mui/icons-material/Language';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import TranslateIcon from '@mui/icons-material/Translate';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getCountryByCode, getBorderCountries } from "../services/api";
import FavoriteButton from "../components/FavoriteButton";

// Create theme for light mode with blue and white accents
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Primary blue color
    },
    secondary: {
      main: '#0d47a1', // Darker blue
    },
    background: {
      default: '#ffffff',
      paper: '#f5f8ff',
    },
    text: {
      primary: '#0d47a1',
      secondary: '#607d8b',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#1976d2', // Blue for header
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // White for cards
          borderColor: '#e0e7ff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderColor: '#1976d2',
          color: '#1976d2',
          '&:hover': {
            borderColor: '#0d47a1',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        },
        contained: {
          backgroundColor: '#1976d2', // Blue button
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#0d47a1',
          },
        },
      },
    },
  },
});

// InfoBox component to handle individual information
const InfoBox = ({ icon, label, value }) => (
  <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#ffffff', width: '100%', mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ color: '#1976d2', fontSize: 24 }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {typeof value === 'string' || typeof value === 'number' ? (
          <Typography variant="body1" fontWeight="medium" color="text.primary">
            {value || "N/A"}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Box>
  </Paper>
);

const CountryDetailPage = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      setLoading(true);
      try {
        const countryData = await getCountryByCode(code);
        setCountry(countryData);

        if (countryData.borders && countryData.borders.length > 0) {
          const borders = await getBorderCountries(countryData.borders);
          setBorderCountries(borders);
        }
      } catch (err) {
        console.error("Error fetching country:", err);
        setError("Failed to load country details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [code]);

  if (loading) {
    return (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <AppBar position="static" sx={{ backgroundColor: "#ffffff", boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #e0e7ff' }}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PublicIcon sx={{ color: "#1976d2", fontSize: 30 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#1976d2" }}>
                Country Finder
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Box sx={{ color: "#1976d2", animation: "spin 2s linear infinite", '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }}>
              <PublicIcon sx={{ fontSize: 60 }} />
            </Box>
            <Typography variant="h6" sx={{ mt: 3, color: '#607d8b' }}>
              Loading country information...
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <AppBar position="static" sx={{ backgroundColor: "#ffffff", boxShadow: 'none', borderBottom: '1px solid #e0e7ff' }}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PublicIcon sx={{ color: "#1976d2", fontSize: 30 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#1976d2" }}>
                Country Finder
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 3, backgroundColor: '#ffebee', color: '#d32f2f' }}>
            {error || "Country not found"}
          </Alert>
          <Button component={RouterLink} to="/" variant="contained" color="primary">
            Return to Home
          </Button>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
  
      <Container sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBackIcon />}
            variant="text"
            color="primary"
            sx={{ fontFamily: "Poppins, sans-serif" }}
          >
            Back to all countries
          </Button>
        </Box>

        {/* Country Name and Heart */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#1976d2', 
              fontWeight: 'bold', 
              flexGrow: 1,  
              textAlign: 'center'  
            }}
          >
            {country.name.common}
          </Typography>
          <FavoriteButton country={country} />
        </Box>

        {/* Country Flag */}
        <Box sx={{ mb: 4, overflow: 'hidden', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <CardMedia
            component="img"
            height="200"
            image={country.flags?.svg || country.flags?.png}
            alt={`Flag of ${country.name.common}`}
            sx={{ objectFit: "contain", backgroundColor: "#f5f5f5" }}
          />
        </Box>

        {/* Vertical Layout with Categories */}
        <Grid container justifyContent="center" spacing={6}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" gutterBottom>Geography</Typography>
              <InfoBox 
                icon={<PublicIcon />} 
                label="Region" 
                value={country.region} 
              />
              <InfoBox 
                icon={<PublicIcon />} 
                label="Sub Region" 
                value={country.subregion || "N/A"} 
              />
              <InfoBox 
                icon={<LanguageIcon />} 
                label="Capital" 
                value={country.capital?.[0] || "N/A"} 
              />
              <InfoBox 
                icon={<PublicIcon />}
                label="Timezones" 
                value={country.timezones?.[0] || "UTC+00:00"} 
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" gutterBottom>Demographics</Typography>
              <InfoBox 
                icon={<PeopleIcon />} 
                label="Population" 
                value={country.population?.toLocaleString() || "N/A"} 
              />
              <InfoBox 
                icon={<TranslateIcon />} 
                label="Languages" 
                value={Object.values(country.languages || {}).join(", ") || "N/A"} 
              />
              <InfoBox 
                icon={<AttachMoneyIcon />} 
                label="Currency" 
                value={
                  country.currencies 
                    ? Object.values(country.currencies).map((cur) => cur.name).join(", ")
                    : "N/A"
                } 
              />
            </Box>
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" gutterBottom>Additional Information</Typography>
              
              
              
              <InfoBox 
                icon={<LanguageIcon />}
                label="Top Level Domain" 
                value={country.tld?.[0] || "N/A"} 
              />
              
              <InfoBox 
                icon={<AttachMoneyIcon />}
                label="Currency" 
                value={country.currencies
                  ? Object.values(country.currencies)
                      .map((c) => `${c.name} ${c.symbol ? `(${c.symbol})` : ''}`)
                      .join(", ")
                  : "N/A"} 
              />
              
              <InfoBox 
                icon={<TranslateIcon />}
                label="Alt Spellings" 
                value={country.altSpellings?.join(", ") || `${country.name.common}, ${country.name.official}`} 
              />
            </Box>
          </Grid>
        </Grid>

        {/* Border Countries */}
        {borderCountries.length > 0 && (
          <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#0d47a1' }}>
              Neighbouring Countries
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {borderCountries.map((b) => (
                <Button
                  key={b.cca3}
                  component={RouterLink}
                  to={`/countries/${b.cca3}`}
                  variant="outlined"
                  sx={{ 
                    textTransform: "none", 
                    borderColor: '#bbdefb', 
                    color: '#1976d2',
                    borderRadius: 1,
                    px: 3,
                    py: 1
                  }}
                >
                  {b.name.common}
                </Button>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default CountryDetailPage;