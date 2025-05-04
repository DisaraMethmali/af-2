"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Card,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import CountryList from "../components/CountryList"
import { getAllCountries, getCountriesByName, getCountriesByRegion } from "../services/api"
import SearchIcon from "@mui/icons-material/Search"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"

const HeroSection = styled(Box)(({ theme }) => ({
  background: "#fff",
  padding: theme.spacing(6, 2),
  textAlign: "center",
  color: "#001f3f",
}))

const StatsCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}))

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const regionFilter = searchParams.get("region") || ""
  const languageFilter = searchParams.get("language") || ""

  const [filterType, setFilterType] = useState("name")
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtered, setFiltered] = useState([])
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Fetch based on URL filters
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true)
      try {
        let result = []

        if (searchQuery) {
          result = await getCountriesByName(searchQuery)
        } else if (regionFilter) {
          result = await getCountriesByRegion(regionFilter)
        } else {
          result = await getAllCountries()
        }

        if (languageFilter && result.length > 0) {
          result = result.filter(
            (country) =>
              country.languages &&
              Object.values(country.languages).some((lang) =>
                lang.toLowerCase().includes(languageFilter.toLowerCase())
              )
          )
        }

        setCountries(result)
      } catch (err) {
        console.error("Error fetching countries:", err)
        setError("Failed to load countries. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [searchQuery, regionFilter, languageFilter])

  // Automatic search on query/filterType change
  useEffect(() => {
    if (!query) {
      setFiltered([])
      return
    }

    const delayDebounce = setTimeout(() => {
      setIsLoading(true)
      handleSearch(filterType, query).then((data) => {
        setFiltered(data)
        setIsLoading(false)
      })
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [query, filterType])

  const handleSearch = async (filterType, query) => {
    let endpoint = ""

    switch (filterType) {
      case "name":
        endpoint = `https://restcountries.com/v3.1/name/${query}`
        break
      case "fullText":
        endpoint = `https://restcountries.com/v3.1/name/${query}?fullText=true`
        break
      case "capital":
        endpoint = `https://restcountries.com/v3.1/capital/${query}`
        break
      case "currency":
        endpoint = `https://restcountries.com/v3.1/currency/${query}`
        break
      case "lang":
        endpoint = `https://restcountries.com/v3.1/lang/${query}`
        break
      case "code":
        endpoint = `https://restcountries.com/v3.1/alpha/${query}`
        break
      case "codes":
        endpoint = `https://restcountries.com/v3.1/alpha?codes=${query}`
        break
      case "region":
      case "subregion":
      case "translation":
        endpoint = `https://restcountries.com/v3.1/all`
        break
      default:
        endpoint = `https://restcountries.com/v3.1/name/${query}`
    }

    try {
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error("Failed to fetch data.")
      const data = await res.json()
      let filteredData = Array.isArray(data) ? data : [data]

      if (filterType === "region") {
        filteredData = filteredData.filter((country) =>
          country.region?.toLowerCase().includes(query.toLowerCase())
        )
      } else if (filterType === "subregion") {
        filteredData = filteredData.filter((country) =>
          country.subregion?.toLowerCase().includes(query.toLowerCase())
        )
      } else if (filterType === "translation") {
        filteredData = filteredData.filter((country) =>
          Object.values(country.translations || {}).some((t) =>
            Object.values(t).some((val) => val?.toLowerCase().includes(query.toLowerCase()))
          )
        )
      }

      return filteredData
    } catch (error) {
      console.error("Search Error:", error.message)
      return []
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", fontFamily: "Poppins, sans-serif" }}>
      <HeroSection>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#001f3f", fontFamily: "Poppins, sans-serif" }}>
            CountryTap - Countries Explorer
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ maxWidth: 600, mx: "auto", opacity: 0.8, fontFamily: "Poppins, sans-serif", mt: 0, mb: 2 }}
            >
              Discover detailed information about countries across the globe
            </Typography>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 2, alignItems: "center" }}>
              <FormControl sx={{ minWidth: 160, borderRadius: "30px", height: "40px" }}>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  IconComponent={ArrowDropDownIcon}
                  sx={{ fontFamily: "Poppins, sans-serif", height: "40px" ,borderRadius: "30px", }}
                >
                  {["name", "fullText", "code", "codes", "capital", "region", "subregion", "lang", "currency", "translation"].map(
                    (option) => (
                      <MenuItem key={option} value={option} sx={{ fontFamily: "Poppins, sans-serif" }}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              <TextField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                variant="outlined"
                size="small"
                sx={{
                  width: { xs: "100%", sm: "53%" },
                  borderRadius: "30px",
                  "& .MuiOutlinedInput-root": { borderRadius: "30px" },
                  "& input": { fontFamily: "Poppins, sans-serif" },
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
                }}
              />

              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setQuery("")
                  setFilterType("name")
                  setFiltered([])
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

      <Container maxWidth="lg" sx={{ mt: 3,mr:4 }}>
        {error ? (
          <Box textAlign="center" py={3}>
            <Typography variant="h6" color="error" fontFamily="Poppins, sans-serif">
              {error}
            </Typography>
          </Box>
        ) : isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <CountryList countries={filtered.length ? filtered : countries} />
        )}
      </Container>
    </Box>
  )
}

export default HomePage


