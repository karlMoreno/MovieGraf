import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';

const logoStyle = {
  width: '190px',
  height: 'auto',
  cursor: 'pointer',
};

function AppAppBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          mt: 2,
        }}
      >
        <Container maxWidth={false}>
          <Toolbar
            variant="dense"
            sx={(theme) => ({
              
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              bgcolor :'transparent',
              maxHeight: 80,
            })}
          >
            
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 0,
              }}
            >
              <img
                src={
                  'https://svgshare.com/i/162T.svg'
                }
                style={logoStyle}
                alt="MovieGraf"
              />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
               
                
                <MenuItem
                  onClick={() => scrollToSection('aboutus')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="contained" color="white" fontFamily="monospace" fontWeight= "bold">
                    About Us
                  </Typography>
                </MenuItem>
                
                <MenuItem
                  onClick={() => scrollToSection('ontology')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="contained" color="white" fontFamily="monospace"fontWeight= "bold">
                    Ontology
                  </Typography>
                </MenuItem>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <Button
                color="primary"
                variant="contained"
                size="large"
                component="a"
                href="/SignIn"
                target="_blank"
                fontFamily="sans-serif"
              >
                 <Typography color="white" fontFamily="monospace"fontWeight= "bold">
                Sign in
                </Typography>
              </Button>
              <Button
                color="primary"
                variant="contained"
                size="large"
                component="a"
                href="/SignUp"
                target="_blank"
                fontFamily="monospace"
              >
                <Typography color="white" fontFamily="monospace"fontWeight= "bold">
                Sign up
                </Typography>
              </Button>
            </Box>
            <Box sx={{ display: { sm: '', md: 'none' } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: '30px', p: '4px' }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: '60dvw',
                    p: 2,
                    backgroundColor: 'background.paper',
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'end',
                      flexGrow: 1,
                    }}
                  >
                  </Box>
                  <MenuItem onClick={() => scrollToSection('aboutus')}>
                    <Typography variant="body2" fontFamily="sans-serif">
                    About Us
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('ontology')}></MenuItem>

                  <Divider />
                  <MenuItem>
                    <Button
                      color="blue"
                      variant="contained"
                      component="a"
                      href="/material-ui/getting-started/templates/sign-up/"
                      target="_blank"
                      fontFamily = "monospace"
                      sx={{ width: '100%' }}
                    >
                      Sign up
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="outlined"
                      component="a"
                      href="/material-ui/getting-started/templates/sign-in/"
                      target="_blank"
                      fontFamily = "sans-serif"
                      sx={{ width: '100%' }}
                    >
                      Sign in
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(['dark']).isRequired,

};

export default AppAppBar;