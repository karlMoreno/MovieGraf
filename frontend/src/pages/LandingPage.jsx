import * as React from 'react';
import PropTypes from 'prop-types';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AppAppBar from '../components/landingPage/AppAppBar';
import Hero from '../components/landingPage/Hero';
import LogoCollection from '../components/landingPage/LogoCollection';
import Highlights from '../components/landingPage/Highlights';
import FAQ from '../components/landingPage/FAQ';
import Footer from '../components/landingPage/Footer';
import getLPTheme from './getLPTheme';
import ReactPlayer from 'react-player';



export default function LandingPage() {
  const [mode, setMode] = React.useState('light');
  const LPtheme = createTheme(getLPTheme(mode));


  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };


  return (
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      
      <Hero />
      <Box sx={{ bgcolor: 'background.default' }}>
        <LogoCollection />
        <Divider />
        <Divider />
        <Highlights />
        <Divider />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </Box>
      
    </ThemeProvider>
  );
}