import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MuiLink } from '@mui/material'; // For any simple hyperlinks (if needed) 
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Assume Copyright is somewhere else and handles its own links

const defaultTheme = createTheme();

export default function SignInSide() {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginDetails = {
      email: data.get('email'),
      password: data.get('password'),
    };
  
   try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginDetails),
      });
      const json = await response.json();
      if (json.success) {
        // Store the token in local storage
        localStorage.setItem('jwtToken', json.token);
        // Navigate to the user's projects page with the token in the URL
        navigate(`/projects?token=${json.token}`);
      } else {
        setError('Invalid Credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="/forgot-password" style={{ textDecoration: "none" }}> {/* Adjusted for navigation */}
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/signup" style={{ textDecoration: "none" }}>
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
              {successMessage && <div>{successMessage}</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
