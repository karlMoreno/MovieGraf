import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';

const items = [
  {
    icon: <ConstructionRoundedIcon />,
    title: 'Karl Moreno',
    description:
      'Back-End Developer',
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: 'Carlos Campos Lozano',
    description:
      'Back-End Developer',
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: 'Sean Ryan',
    description:
      'Back-End Developer',
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: 'Jessica Christine Rosero',
    description:
      'Front-End Developer',
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: 'Isaiah Paul-Mcglothin',
    description:
      'Front-End Developer',
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: 'Kayla Young',
    description:
      'Front-End Developer',
  },
];

export default function AboutUs() {
  return (
    <Box
      id="aboutus"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: '#06090a',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h1" variant="h4" fontFamily="monospace" fontWeight="bold">
            Meet Our Team!
          </Typography>
        </Box>
        <Grid container spacing={2.5}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Stack
                direction="column"
                color="inherit"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  p: 3,
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'grey.800',
                  background: 'transparent',
                  backgroundColor: 'grey.900',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography variant="h5" fontFamily="monospace" fontWeight="medium" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="h5" fontFamily="monospace" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}