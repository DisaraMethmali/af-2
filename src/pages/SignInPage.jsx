import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Button, TextField, Typography, Box, Grid } from '@mui/material';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue theme
    },
    background: {
      default: '#f4f6f8', // Light background
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Rounded corners for all text fields
        },
      },
    },
  },
});

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login({ email, password });
      showToast({
        title: 'Welcome back!',
        message: 'You have successfully signed in.',
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      login({
        email: `demo@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      });
      showToast({
        title: 'Welcome!',
        message: `You have successfully signed in with ${provider}.`,
      });
      navigate(from, { replace: true });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="container" sx={{ display: 'flex', justifyContent: 'center', minHeight: '80vh', py: 8 }}>
        <Box className="card" sx={{ width: '800px', maxWidth: 'md', p: 6, borderRadius: 3, boxShadow: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Sign in
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sign in to your account to save your favorite countries
            </Typography>
          </Box>

          <Box sx={{ mb: 3, justifyContent: "center", alignItems: 'center' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleOAuthSignIn('github')}
                  disabled={isLoading}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    alignItems: 'center',
                    fontWeight: 500,
                    borderColor: 'grey.400',
                    borderRadius: '15px',
                    backgroundImage: 'linear-gradient(45deg, #333, #555)',
                    color: 'white',
                    textTransform: 'capitalize',
                    padding: '8px 0', // Reduced height
                    '&:hover': {
                      backgroundImage: 'linear-gradient(45deg, #555, #333)',
                    },
                  }}
                >
                  <FaGithub />
                  GitHub
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={isLoading}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    alignItems: 'center',
                    fontWeight: 500,
                    borderColor: 'grey.400',
                    borderRadius: '15px',
                    backgroundImage: 'linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335)',
                    color: 'white',
                    textTransform: 'capitalize',
                    padding: '8px 0', // Reduced height
                    '&:hover': {
                      backgroundImage: 'linear-gradient(45deg, #EA4335, #FBBC05, #34A853, #4285F4)',
                    },
                  }}
                >
                  <FaGoogle />
                  Google
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ position: 'relative', mb: 3 }}>
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flexGrow: 1, height: 1, borderTop: 1, borderColor: 'divider' }} />
            </Box>
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', color: 'text.secondary' }}>
              <Typography variant="body2" sx={{ backgroundColor: 'background.paper', px: 2 }}>
                Or continue with
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                variant="outlined"
                size="small" // Reduced size
                disabled={isLoading}
                InputProps={{
                  sx: {
                    borderRadius: '20px',
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                variant="outlined"
                size="small" // Reduced size
                disabled={isLoading}
                InputProps={{
                  sx: {
                    borderRadius: '20px',
                  }
                }}
              />
            </Box>

            {error && <Typography sx={{ color: 'error.main', textAlign: 'center', mb: 2 }}>{error}</Typography>}

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                padding: '8px 0', // Reduced height
                borderRadius: '20px',
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SignInPage;