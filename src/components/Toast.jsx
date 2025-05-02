import { useEffect } from "react";
import { Box, Typography, IconButton, Paper, ThemeProvider, createTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";

// Create theme with Poppins font
const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
    allVariants: {
      fontFamily: '"Poppins", sans-serif',
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'white'
        }
      }
    }
  }
});

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const getIcon = () => {
    switch (toast.type) {
      case "error":
        return <ErrorIcon sx={{ color: "#f44336", fontSize: "1.5rem" }} />;
      default:
        return <CheckCircleIcon sx={{ color: "#4caf50", fontSize: "1.5rem" }} />;
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1300,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderRadius: 2,
          bgcolor: "white",
          p: 2,
          maxWidth: 360,
          border: "1px solid",
          borderColor: "grey.200",
          fontFamily: '"Poppins", sans-serif !important'
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          {getIcon()}
        </Box>
        <Box sx={{ flex: 1 }}>
          {toast.title && (
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                fontFamily: '"Poppins", sans-serif !important',
                color: toast.type === "error" ? "#f44336" : "#4caf50"
              }}
            >
              {toast.title}
            </Typography>
          )}
          {toast.message && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: "text.secondary", 
                fontFamily: '"Poppins", sans-serif !important' 
              }}
            >
              {toast.message}
            </Typography>
          )}
        </Box>
        <IconButton 
          size="small" 
          onClick={onClose} 
          sx={{ flexShrink: 0, color: "grey.500", "&:hover": { color: "grey.800" } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Paper>
    </ThemeProvider>
  );
};

export default Toast;