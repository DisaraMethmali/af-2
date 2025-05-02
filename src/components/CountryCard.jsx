import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Link as MuiLink,
  Divider,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FavoriteButton from "./FavoriteButton";

// Styled Card
const StyledCard = styled(Card)(({ theme }) => ({
  height: "380px",
  width: "250px",
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
}));

// Wrapper for flag image
const FlagWrapper = styled(Box)({
  width: "250px",
  height: "200px",
  backgroundColor: "#f5f5f5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
});

// Styled Flag Image
const StyledFlagImage = styled("img")({
  width: "230px",
  height: "150px",
  objectFit: "cover",
  
});

// CountryCard component
const CountryCard = ({ country }) => {
  const { flags, name, population, region, capital, cca3 } = country;

  return (
    <StyledCard>
      <FlagWrapper>
        <StyledFlagImage
          src={flags.svg || flags.png}
          alt={flags.alt || `Flag of ${name.common}`}
          loading="lazy"
        />
      </FlagWrapper>

      <CardContent sx={{ flexGrow: 1, px: 3, pt: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
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

        <Divider sx={{ mb: 1.5 }} />

        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Population:</strong>{" "}
          {new Intl.NumberFormat().format(population)}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Region:</strong> {region || "N/A"}
        </Typography>
        <Typography variant="body2">
          <strong>Capital:</strong> {capital?.[0] || "N/A"}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 3, pb: 2 }}>
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
      </CardActions>
    </StyledCard>
  );
};

export default CountryCard;

