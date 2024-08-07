import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Link from "@mui/material/Link";
import { MainListItems, secondaryListItems } from "../components/dashboard/listItems";
import Chart from "../components/dashboard/Chart";
import { Navigate, useNavigate } from "react-router-dom";
import AssetPage from "../components/dashboard/AssetsPage";
import ArtistsPage from "../components/dashboard/ArtistsPage";
import TasksPage from "../components/dashboard/TasksPage";
import Timeline from "../components/dashboard/TimelinePage";
import ModelViewerPage from "../components/dashboard/ModelViewerPage";
import Paper from '@mui/material/Paper';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState("dashboard");

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: "24px" }}>
            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer} sx={{ marginRight: "36px", ...(open && { display: "none" }) }}>
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", px: [1] }}>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems onNavigate={handleNavigate} />
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>

        <Box component="main" sx={{ backgroundColor: (theme) => theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100], flexGrow: 1, height: "100vh", overflow: "auto" }}>
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {currentPage === "dashboard" && (
              <Grid container spacing={3}>
                {/* Chart */}
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Chart />
                  </Paper>
                </Grid>
                {/* Timeline */}
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Timeline />
                  </Paper>
                </Grid>
              </Grid>
            )}
            {currentPage === "assets" && <AssetPage />}
            {currentPage === "artists" && <ArtistsPage />}
            {currentPage === "tasks" && <TasksPage />}
            {currentPage === "model" && <ModelViewerPage />}
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
