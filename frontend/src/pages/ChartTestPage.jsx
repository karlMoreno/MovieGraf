import React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import ChartTest from '../components/dashboard/ChartTest'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const ChartTestPage = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box
          component='main'
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? theme.palette.grey[900]
                : theme.palette.grey[100],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <ChartTest />
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ChartTestPage;
