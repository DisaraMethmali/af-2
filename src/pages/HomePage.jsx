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
  FilterList as FilterIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import CountryList from "../components/CountryList";
import { getAllCountries, getCountriesByName, getCountriesByRegion } from "../services/api";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
const HeroSection = styled(Box)(({ theme }) => ({
  background: "#fff", // white background
  padding: theme.spacing(6, 2),
  textAlign: "center",
  color: "#001f3f", // deep blue text
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
  const [filterType, setFilterType] = useState("name");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");
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

  const handleSearch = async () => {
    if (!query) return setFiltered(countries);

    setIsLoading(true);
    try {
      let endpoint = "";

      switch (filterType) {
        case "name":
        case "capital":
        case "region":
        case "subregion":
        case "currency":
        case "lang":
        case "translation":
          endpoint = `https://restcountries.com/v3.1/${filterType}/${query}`;
          break;
        case "code":
          endpoint = `https://restcountries.com/v3.1/alpha/${query}`;
          break;
        case "codes":
          endpoint = `https://restcountries.com/v3.1/alpha?codes=${query}`;
          break;
        case "fullText":
          endpoint = `https://restcountries.com/v3.1/name/${query}?fullText=true`;
          break;
        default:
          endpoint = `https://restcountries.com/v3.1/name/${query}`;
      }

      const res = await fetch(endpoint);

      if (!res.ok) {
        console.warn("Invalid filter or query");
        setFiltered([]);
      } else {
        const data = await res.json();
        setFiltered(Array.isArray(data) ? data : [data]);
      }

      setPage(1);
    } catch (err) {
      console.error("Search error:", err);
      setFiltered([]);
    }
    setIsLoading(false);
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
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 0 }}>
            {/* Title and Icon */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 0 }}>
              <GlobeIcon sx={{ fontSize: 48, mr: 1 }} />
              <Typography variant="h3" fontWeight={700} sx={{ color: "#001f3f",fontFamily: "Poppins, sans-serif" }}>
  REST Countries Explorer
</Typography>

            </Box>
            <Typography variant="subtitle1" sx={{ maxWidth: 600, mx: "auto", opacity: 0.8,fontFamily: "Poppins, sans-serif",mt: 0,  mb: 4,  }}>
              Discover detailed information about countries across the globe
            </Typography>

            
            <Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    gap: 2,
    mb: 4,
    alignItems: "center",
  }}
>
  {/* Filter Type Dropdown */}
  <FormControl sx={{
    minWidth: 160,
    borderRadius: "30px", height:"40px",fontFamily: "Poppins",// fully rounded
    "& .MuiOutlinedInput-root": {
      borderRadius: "30px",
    },
  }}>
    <InputLabel sx={{fontFamily: "Poppins, sans-serif",}}>Filter</InputLabel>
    <Select
      value={filterType}
      onChange={(e) => setFilterType(e.target.value)}
      label="Filter"
      IconComponent={ArrowDropDownIcon}
      sx={{fontFamily: "Poppins, sans-serif",height:"40px"}}
    >
      {[
        "name",
        "fullText",
        "code",
        "codes",
        "capital",
        "region",
        "subregion",
        "lang",
        "currency",
        "translation",
      ].map((option) => (
        <MenuItem key={option} value={option} sx={{fontFamily: "Poppins, sans-serif"}}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  {/* Search Input */}
  <TextField
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search..."
    variant="outlined"
    size="small"
    sx={{
      width: { xs: "100%", sm: "33%" },
      borderRadius: "30px",
      "& .MuiOutlinedInput-root": {
        borderRadius: "30px",
      },
      "& input": {
        fontFamily: "Poppins, sans-serif",
      },
    }}
    InputProps={{
      startAdornment: (
        <SearchIcon sx={{ color: "gray", mr: 1 }} />
      ),
    }}
  />

  {/* Search Button */}
  <Button
    variant="contained"
    color="primary"
    onClick={handleSearch}
    sx={{
      height: "40px",
      px: 3,
      borderRadius: "30px",
      textTransform: "none",
      fontFamily: "Poppins, sans-serif",
    }}
  >
    Search
  </Button>

  {/* Reset Button */}
  <Button
    variant="outlined"
    color="inherit"
    onClick={() => {
      setQuery("");
      setFilterType("name");
      setFiltered(countries);
      setPage(1);
    }}
    sx={{
      height: "40px",
      px: 3,
      borderRadius: "30px",
      textTransform: "none",
      fontFamily: "Poppins, sans-serif",
    }}
  >
    Reset
  </Button>
</Box>

            
          </Box>
        </Container>
      </HeroSection>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ mt:0 }}>
       

        {/* Country List */}
        {error ? (
          <Box textAlign="center" py={0} sx={{ mt:0 }}>
            <Typography variant="h6" color="error" fontFamily="Poppins, sans-serif">
              {error}
            </Typography>
          </Box>
        ) : (
          <Container maxWidth="lg" sx={{ py: 6, pr: "0px", pl: "40px" }}>
            <CountryList countries={countries} loading={loading} />
          </Container>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;

