import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
} from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function TasksForm({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [progressState, setProgressState] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [priority, setPriority] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('assignedTo', assignedTo);
    formData.append('progressState', progressState);
    formData.append('startDate', startDate ? startDate.toISOString() : '');
    formData.append('endDate', endDate ? endDate.toISOString() : '');
    formData.append('priority', priority);
    if (file) {
      formData.append('thumbnail', file);
    }

    try {
      const response = await fetch('http://localhost:3002/api/tasks/tasks-create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create Task');
      }

      console.log('Task created successfully');
      onClose(); // Close the drawer after form submission
      window.location.reload(); // Reload the page to see the changes
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error creating Task');
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 400,
          margin: "auto",
          padding: "20px",
          marginTop: "80px",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" gutterBottom>
            Create New Task
          </Typography>
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="Thumbnail"
              style={{ width: "100%", marginBottom: 16 }}
            />
          )}
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Assigned to (Artist)</InputLabel>
            <Select
              value={assignedTo}
              label="Assigned to (Artist)"
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <MenuItem value="Alice">Alice</MenuItem>
              <MenuItem value="Bob">Bob</MenuItem>
              <MenuItem value="Charlie">Charlie</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Progress State</InputLabel>
            <Select
              value={progressState}
              label="Progress State"
              onChange={(e) => setProgressState(e.target.value)}
            >
              <MenuItem value="Not Started">Not Started</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Complete">Complete</MenuItem>
            </Select>
          </FormControl>
          <MobileDatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <MobileDatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          <label htmlFor="upload-button-file">
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload Thumbnail
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </label>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Stack>
      </form>
    </LocalizationProvider>
  );
}
