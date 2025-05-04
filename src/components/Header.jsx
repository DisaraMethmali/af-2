"use client"

import { useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
  Avatar,
  Tooltip,
  Link,
  useMediaQuery,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import {
  Public as GlobeIcon,
  Favorite as HeartIcon,
  AccountCircle,
  Menu as MenuIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
} from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"

const Header = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { user, logout } = useAuth()

  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null)
  const [activeButton, setActiveButton] = useState(window.location.pathname)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenu = (event) => {
    setMobileMenuAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
    handleMobileMenuClose()
  }
  
  const handleNavClick = (path) => {
    setActiveButton(path)
  }

  // Common button styles for navigation links
  const navButtonStyles = {
    fontFamily: "Poppins, sans-serif",
    fontSize: "1rem", // Increased font size
    fontWeight: 500,
    textTransform: "none",
    px: 2,
    mx: 0.5,
    borderRadius: "4px",
    transition: "all 0.3s ease",
    position: "relative",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transform: "translateY(-2px)",
    },
    "&:active": {
      transform: "translateY(1px)",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "50%",
      width: "0%",
      height: "3px",
      backgroundColor: "#4caf50", // Green underline
      transition: "all 0.3s ease",
      transform: "translateX(-50%)",
      opacity: 0,
    },
    "&.active::after": {
      width: "60%",
      opacity: 1,
    },
    "&:hover::after": {
      width: "60%",
      opacity: 1,
    }
  }

  // Enhanced MenuItem styles for mobile menu
  const mobileMenuItemStyles = {
    fontFamily: "Poppins, sans-serif",
    fontSize: "1.1rem", // Increased font size for mobile
    py: 1.2,
    px: 2,
    "&:hover": {
      backgroundColor: "rgba(0, 31, 63, 0.08)",
    },
    "&.active": {
      backgroundColor: "rgba(0, 31, 63, 0.12)",
      borderLeft: "4px solid #4caf50",
    }
  }

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#001f3f", color: "#fff" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 2, justifyContent: "space-between" }}>
          {/* Logo and Title */}
          <Link
            component={RouterLink}
            to="/"
            underline="none"
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
              color: "#fff",
              fontFamily: "Poppins, sans-serif",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              }
            }}
            onClick={() => handleNavClick("/")}
          >
            <GlobeIcon sx={{ mr: 1, fontSize: "2rem" }} /> {/* Increased icon size */}
            <Typography 
              variant="h5" 
              sx={{ 
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                letterSpacing: "0.5px"
              }}
            >
             CountryTap
            </Typography>
          </Link>

          {/* Navigation Links */}
          {isMobile ? (
            <>
              <IconButton 
                color="inherit" 
                onClick={handleMobileMenu}
                sx={{
                  padding: 1,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }
                }}
              >
                <MenuIcon sx={{ fontSize: "1.8rem" }} /> {/* Increased icon size */}
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchorEl}
                open={Boolean(mobileMenuAnchorEl)}
                onClose={handleMobileMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    width: 220,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                  }
                }}
              >
                <MenuItem 
                  component={RouterLink} 
                  to="/" 
                  onClick={() => {
                    handleMobileMenuClose()
                    handleNavClick("/")
                  }}
                  sx={mobileMenuItemStyles}
                  className={activeButton === "/" ? "active" : ""}
                >
                  Home
                </MenuItem>
                <MenuItem 
                  component={RouterLink} 
                  to="/about" 
                  onClick={() => {
                    handleMobileMenuClose()
                    handleNavClick("/about")
                  }}
                  sx={mobileMenuItemStyles}
                  className={activeButton === "/all-countries" ? "active" : ""}
                >
                  All Countries
                </MenuItem>
                {user && (
                  <MenuItem 
                    component={RouterLink} 
                    to="/favorites" 
                    onClick={() => {
                      handleMobileMenuClose()
                      handleNavClick("/favorites")
                    }}
                    sx={mobileMenuItemStyles}
                    className={activeButton === "/favorites" ? "active" : ""}
                  >
                    Favorites
                  </MenuItem>
                )}
                <MenuItem 
                  onClick={handleMobileMenuClose}
                  sx={mobileMenuItemStyles}
                >
                  Settings
                </MenuItem>
                <MenuItem 
                  onClick={handleMobileMenuClose}
                  sx={mobileMenuItemStyles}
                >
                  Popular
                </MenuItem>
                {user ? (
                  <MenuItem 
                    onClick={handleLogout}
                    sx={mobileMenuItemStyles}
                  >
                    <LogoutIcon sx={{ mr: 1.5 }} />
                    Logout
                  </MenuItem>
                ) : (
                  <>
                    <MenuItem 
                      component={RouterLink} 
                      to="/login" 
                      onClick={() => {
                        handleMobileMenuClose()
                        handleNavClick("/login")
                      }}
                      sx={mobileMenuItemStyles}
                      className={activeButton === "/login" ? "active" : ""}
                    >
                      <LoginIcon sx={{ mr: 1.5 }} />
                      Login
                    </MenuItem>
                    <MenuItem 
                      component={RouterLink} 
                      to="/signin" 
                      onClick={() => {
                        handleMobileMenuClose()
                        handleNavClick("/signin")
                      }}
                      sx={{
                        ...mobileMenuItemStyles,
                        bgcolor: "#4caf50",
                        color: "white",
                        my: 1,
                        mx: 2,
                        borderRadius: "4px",
                        "&:hover": {
                          bgcolor: "#3d8b40",
                        }
                      }}
                    >
                      Sign Up
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", mx: "auto" }}>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/" 
                  sx={navButtonStyles}
                  className={activeButton === "/" ? "active" : ""}
                  onClick={() => handleNavClick("/")}
                >
                  Home
                </Button>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/all-countries" 
                  sx={navButtonStyles}
                  className={activeButton === "/all-countries" ? "active" : ""}
                  onClick={() => handleNavClick("/all-countries")}
                >
                  All Countries
                </Button>
                {user && (
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/favorites"
                    sx={navButtonStyles}
                    className={activeButton === "/favorites" ? "active" : ""}
                    onClick={() => handleNavClick("/favorites")}
                  >
                    Favorites
                  </Button>
                )}
                <Button 
                  color="inherit" 
                  sx={navButtonStyles}
                >
                  Settings
                </Button>
                <Button 
                  color="inherit" 
                  sx={navButtonStyles}
                >
                  Popular
                </Button>
              </Box>

              {/* Account / Auth Buttons */}
              {user ? (
                <Box>
                  <Tooltip title="Account settings">
                    <IconButton 
                      onClick={handleMenu} 
                      sx={{ 
                        ml: 2,
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                        }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: "primary.light", 
                          width: 40, 
                          height: 40,
                          boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
                        }}
                      >
                        {user.name ? user.name.charAt(0).toUpperCase() : <AccountCircle />}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                      sx: {
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        width: 200
                      }
                    }}
                  >
                    <MenuItem 
                      component={RouterLink} 
                      to="/favorites" 
                      onClick={handleClose} 
                      sx={{ 
                        py: 1.5,
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "0.95rem",
                        "&:hover": {
                          bgcolor: "rgba(0, 31, 63, 0.05)",
                        }
                      }}
                    >
                      <HeartIcon fontSize="small" sx={{ mr: 1.5, color: "#f44336" }} />
                      My Favorites
                    </MenuItem>
                    <MenuItem 
                      onClick={handleLogout} 
                      sx={{ 
                        py: 1.5,
                        fontFamily: "Poppins, sans-serif", 
                        fontSize: "0.95rem",
                        "&:hover": {
                          bgcolor: "rgba(0, 31, 63, 0.05)",
                        }
                      }}
                    >
                      <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: "#757575" }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Button
                    color="inherit"
                    startIcon={<LoginIcon />}
                    component={RouterLink}
                    to="/signin"
                    sx={{ 
                      textTransform: "none", 
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "1rem",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/signin"
                    sx={{ 
                      textTransform: "none", 
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "1rem",
                      fontWeight: 500,
                      px: 2.5,
                      bgcolor: "#4caf50",
                      borderRadius:"30px",
                      "&:hover": {
                        bgcolor: "#3d8b40",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header



