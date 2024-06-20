import * as React from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Projects() {
  const [projects, setProjects] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/projects/list`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setProjects(data.projects);
        } else {
          navigate("/signin");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        navigate("/signin");
      }
    };

    fetchProjects();
  }, [navigate]);

  const handleProjectClick = () => {
    navigate(`/dashboard`);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNewProjectChange = (event) => {
    setNewProjectName(event.target.value);
  };

  const handleNewProjectSubmit = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/projects/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newProjectName }),
      });

      const data = await response.json();
      if (data.success) {
        setProjects([...projects, data.project]);
        handleClose();
      } else {
        console.error("Error creating project:", data.message);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3002/api/projects/delete/${projectId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
      } else {
        console.error("Error deleting project:", data.message);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
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
              {projects.map((project) => (
                <Grid item key={project.id} xs={12} sm={6} md={4}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 140,
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <Typography
                      component="h2"
                      variant="h6"
                      color="inherit"
                      noWrap
                    >
                      {project.name}
                    </Typography>
                    <IconButton
                      color="secondary"
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                    >
                      <DeleteIcon style={{ color: "white" }} />
                    </IconButton>
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
                    cursor: "pointer",
                  }}
                  onClick={handleClickOpen} // Open dialog when clicking on "New Project"
                >
                  <IconButton
                    color="primary"
                    aria-label="add new project"
                    component="span"
                  >
                    <AddCircleOutlineIcon style={{ fontSize: 40 }} />
                  </IconButton>
                  <Typography
                    component="h2"
                    variant="h6"
                    color="inherit"
                    noWrap
                  >
                    New Project
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name of the new project.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Project Name"
            type="text"
            fullWidth
            value={newProjectName}
            onChange={handleNewProjectChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNewProjectSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
