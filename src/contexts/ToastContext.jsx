"use client"

import { createContext, useContext, useState } from "react"
import { Snackbar, Box, IconButton, ThemeProvider, createTheme } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// Create custom theme with Poppins font
const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
    allVariants: {
      fontFamily: '"Poppins", sans-serif',
    },
  },
});

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null)
  const [open, setOpen] = useState(false)
  
  const showToast = ({ title, message, type = "success" }) => {
    setToast({ title, message, type })
    setOpen(true)
  }
  
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }
  
  // Get background color based on toast type
  const getBackgroundColor = (type) => {
    switch (type) {
      case "success":
        return "#4caf50" // Green
      case "error":
        return "#f44336" // Red
      case "warning":
        return "#ff9800" // Orange
      case "info":
        return "#2196f3" // Blue
      default:
        return "#4caf50" // Default green
    }
  }
  
  return (
    <ThemeProvider theme={theme}>
      <ToastContext.Provider value={{ showToast }}>
        {children}
        {toast && (
          <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: getBackgroundColor(toast.type),
                color: 'white',
                padding: '10px 16px',
                borderRadius: '4px',
                boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
                minWidth: '300px',
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              <CheckCircleIcon sx={{ marginRight: 1 }} />
              
              <Box sx={{ flex: 1, ml: 1 }}>
                {toast.title && (
                  <Box component="span" sx={{ 
                    display: 'block', 
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    fontFamily: '"Poppins", sans-serif',
                  }}>
                    {toast.title}
                  </Box>
                )}
                <Box component="span" sx={{ 
                  display: 'block',
                  fontSize: '0.875rem',
                  fontFamily: '"Poppins", sans-serif',
                }}>
                  {toast.message}
                </Box>
              </Box>
              
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
                sx={{
                  padding: '4px',
                  marginLeft: 1,
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Snackbar>
        )}
      </ToastContext.Provider>
    </ThemeProvider>
  )
}

export default ToastProvider
