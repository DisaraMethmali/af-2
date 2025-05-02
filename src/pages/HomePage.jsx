import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  Public as GlobeIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import CountryList from "../components/CountryList";
import { getAllCountries, getCountriesByName, getCountriesByRegion } from "../services/api";

const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
const languages = ["English", "Spanish", "French", "Arabic", "Chinese", "Russian", "Portuguese", "German"];

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(120deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  padding: theme.spacing(10, 2),
  textAlign: "center",
  color: "#fff",
}));

const SearchPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

const FilterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const StatsCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}));

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const regionFilter = searchParams.get("region") || "";
  const languageFilter = searchParams.get("language") || "";

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        let result = [];

        if (searchQuery) {
          result = await getCountriesByName(searchQuery);
        } else if (regionFilter) {
          result = await getCountriesByRegion(regionFilter);
        } else {
          result = await getAllCountries();
        }

        if (languageFilter && result.length > 0) {
          result = result.filter((country) =>
            country.languages &&
            Object.values(country.languages).some((lang) =>
              lang.toLowerCase().includes(languageFilter.toLowerCase())
            )
          );
        }

        setCountries(result);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to load countries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [searchQuery, regionFilter, languageFilter]);

  const handleSearch = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    setSearchParams(params);
  };

  const handleRegionChange = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("region", value);
    } else {
      params.delete("region");
    }

    setSearchParams(params);
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("language", value);
    } else {
      params.delete("language");
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = searchQuery || regionFilter || languageFilter;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", fontFamily: "Poppins, sans-serif" }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
            <GlobeIcon sx={{ fontSize: 48, mr: 1 }} />
            <Typography variant="h3" fontWeight={700}>
              REST Countries Explorer
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ maxWidth: 600, mx: "auto", opacity: 0.8 }}>
            Discover detailed information about countries across the globe
          </Typography>

          {/* Search */}
          <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
            <SearchPaper>
              <TextField
                fullWidth
                placeholder="Search by country name..."
                value={searchQuery}
                onChange={handleSearch}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" },
                  },
                }}
              />
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="contained"
                color="secondary"
                sx={{ height: 56, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                <FilterIcon />
              </Button>
              {hasFilters && (
                <Button
                  onClick={clearFilters}
                  color="error"
                  variant="contained"
                  sx={{ height: 56 }}
                >
                  <CloseIcon />
                </Button>
              )}
            </SearchPaper>
          </Box>

          {/* Filters */}
          {showFilters && (
            <FilterPaper sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Region</InputLabel>
                    <Select
                      value={regionFilter}
                      onChange={handleRegionChange}
                      label="Region"
                    >
                      <MenuItem value="">All Regions</MenuItem>
                      {regions.map((region) => (
                        <MenuItem key={region} value={region}>
                          {region}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={languageFilter}
                      onChange={handleLanguageChange}
                      label="Language"
                    >
                      <MenuItem value="">All Languages</MenuItem>
                      {languages.map((lang) => (
                        <MenuItem key={lang} value={lang}>
                          {lang}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FilterPaper>
          )}
        </Container>
      </HeroSection>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Stats */}
        <StatsCard>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6} md="auto">
                <Typography variant="caption" color="text.secondary">
                  Total Countries
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {loading ? <CircularProgress size={24} /> : countries.length}
                </Typography>
              </Grid>

              {regionFilter && (
                <Grid item xs={6} md="auto">
                  <Typography variant="caption" color="text.secondary">
                    Region
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {regionFilter}
                  </Typography>
                </Grid>
              )}

              {languageFilter && (
                <Grid item xs={6} md="auto">
                  <Typography variant="caption" color="text.secondary">
                    Language
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {languageFilter}
                  </Typography>
                </Grid>
              )}

              {searchQuery && (
                <Grid item xs={6} md="auto">
                  <Typography variant="caption" color="text.secondary">
                    Search
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    "{searchQuery}"
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </StatsCard>

       {/* Country List */}
{error ? (
  <Box textAlign="center" py={6}>
    <Typography variant="h6" color="error">
      {error}
    </Typography>
  </Box>
) : (
  <Container maxWidth="lg" sx={{ py: 6, px: '40px' }}>
    <CountryList countries={countries} loading={loading} />
  </Container>
)}

      </Container>
    </Box>
  );
};

export default HomePage;

