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
} from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"

const Header = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { user, logout } = useAuth()

  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null)

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

  return (
    <AppBar position="sticky" color="default" elevation={3}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 2 }}>
          <Link
            component={RouterLink}
            to="/"
            color="inherit"
            underline="none"
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            <GlobeIcon sx={{ mr: 1, fontSize: "1.5rem" }} />
            <Typography variant="h5" component="div">
              REST Countries
            </Typography>
          </Link>

          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton color="inherit" aria-label="menu" onClick={handleMobileMenu} edge="start">
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(mobileMenuAnchorEl)}
                onClose={handleMobileMenuClose}
              >
                <MenuItem component={RouterLink} to="/" onClick={handleMobileMenuClose}>
                  Home
                </MenuItem>
                {user && (
                  <MenuItem component={RouterLink} to="/favorites" onClick={handleMobileMenuClose}>
                    <HeartIcon fontSize="small" sx={{ mr: 1 }} />
                    Favorites
                  </MenuItem>
                )}
                {user ? (
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                ) : (
                  <MenuItem component={RouterLink} to="/signin" onClick={handleMobileMenuClose}>
                    Sign In
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: "flex" }}>
                <Button color="inherit" component={RouterLink} to="/" sx={{ fontWeight: 500 }}>
                  Home
                </Button>
                {user && (
                  <Button color="inherit" component={RouterLink} to="/favorites" startIcon={<HeartIcon />} sx={{ fontWeight: 500 }}>
                    Favorites
                  </Button>
                )}
              </Box>

              {user ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleMenu}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                    >
                      <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : <AccountCircle />}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem component={RouterLink} to="/favorites" onClick={handleClose}>
                      <HeartIcon fontSize="small" sx={{ mr: 1 }} />
                      My Favorites
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Button variant="contained" color="primary" component={RouterLink} to="/signin" sx={{ fontWeight: 600 }}>
                  Sign In
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header


