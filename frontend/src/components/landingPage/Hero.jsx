import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ReactPlayer from 'react-player';

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} sx={{ width: { xs: '100%', sm: '70%' } }}>
          <Typography variant="h1" sx={{ textAlign: 'center', fontSize: 'clamp(3.5rem, 10vw, 4rem)' }}>
            <Typography
              component="span"
              variant="title"
              sx={{
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                fontFamily: "monospace",
                fontWeight: "bold"
              }}
            >
              MovieGraf
            </Typography>
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' },
            fontFamily: "monospace",
            variant: "h4",
            fontWeight: "bold",
           }}
            
          >
            Utilizing the Ontology for Media Creation and Graph Databases to optimize your projects.
 
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' },
            fontFamily: "monospace",
            variant: "h4",
            fontWeight: "bold",
           }}
            
          >
            Based on an original concept by Jeroen Lapré
 
          </Typography>
        </Stack>
        <Box
          sx={{
            mt: 8,
            height: 650, // Adjust the height as necessary
            width: '100%',
            borderRadius: '10px',
            outline: '1px solid',
            outlineColor: alpha('#BFCCD9', 0.5),
            boxShadow: `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}`,
            overflow: 'hidden',
            position: 'relative', // Add relative positioning here
          }}
        >
          <ReactPlayer
            url="http://localhost:3000/vecteezy_abstract-plexus-tech-background-with-glowing-blue-shiny_21050150.mp4"
            playing
            loop
            muted
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </Box>
      </Container>
    </Box>
  );
}