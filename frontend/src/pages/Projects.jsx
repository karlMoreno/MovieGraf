import * as React from "react";
import { useNavigate, Link } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// TODO: Populate list from nodes one level down from user
const projects = [
  { name: "MovieGraf" },
  { name: "Project Gemini" },
  { name: "Project Apollo" },
  { name: "Project Shuttle" }
];

export default function Projects() {
  const navigate = useNavigate();

  const handleProjectClick = () => {
    navigate('/dashboard');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.grey[900]
                : theme.palette.grey[100],
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {projects.map((project, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 140,
                      cursor: 'pointer',
                    }}
                    onClick={handleProjectClick}
                  >
                    <Typography component="h2" variant="h6" color="inherit" noWrap>
                      {project.name}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 140,
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate('/dashboard')} // Navigate when clicking on "New Project"
                >
                  <IconButton color="primary" aria-label="add new project" component="span">
                    <AddCircleOutlineIcon style={{ fontSize: 40 }} />
                  </IconButton>
                  <Typography component="h2" variant="h6" color="inherit" noWrap>
                    New Project
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}