import { Link } from "react-router-dom"
import { Card, CardContent, Typography, Box, Link as MuiLink, Divider, Tooltip } from "@mui/material"
import { styled } from "@mui/material/styles"
import FavoriteButton from "./FavoriteButton"

// Styled Card
const StyledCard = styled(Card)(({ theme }) => ({
  height: "260px",
  display: "flex",
  flexDirection: "column",
  borderRadius: "16px",
  boxShadow: theme.shadows[3],
  transition: "all 0.3s ease",
  backgroundColor: "#fff",
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "translateY(-6px)",
  },
}))

// Wrapper for flag image
const FlagWrapper = styled(Box)({
  width: {md:"250px",xs:"290px"},
  height: "180px",
  backgroundColor: "#f5f5f5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
})

// Styled Flag Image
const StyledFlagImage = styled("img")({
  objectFit: "cover",
  height:"150px"
})

// CountryCard component
const CountryCard = ({ country }) => {
  const { flags, name, population, region, capital, cca3 } = country

  return (
    <StyledCard sx={{width:{md:"250px",xs:"290px"}}}>
      <FlagWrapper>
        <StyledFlagImage sx={{width:{md:"230px",xs:"280px"}}} src={flags.svg || flags.png} alt={flags.alt || `Flag of ${name.common}`} loading="lazy" />
      </FlagWrapper>

      <CardContent sx={{ flexGrow: 1, px: 4, pt: 2, pb: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 0, // Removed margin bottom
          }}
        >
          <Tooltip title={name.common}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 600,
                fontSize: "1.125rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "85%",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {name.common}
            </Typography>
          </Tooltip>

          <FavoriteButton country={country} />
        </Box>
      </CardContent>

      <Divider sx={{ mx: 3, mb: 0, mt: 0 }} />

      <Box sx={{ px: 3, mt: 1 ,mb:1}}>
        <MuiLink
          component={Link}
          to={`/countries/${cca3}`}
          underline="none"
          sx={{
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "primary.main",
            transition: "color 0.3s",
            "&:hover": {
              color: "primary.dark",
              textDecoration: "underline",
            },
          }}
        >
          View Details →
        </MuiLink>
      </Box>
    </StyledCard>
  )
}

export default CountryCard


