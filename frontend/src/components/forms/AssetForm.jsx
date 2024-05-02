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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from '@mui/material/styles';

export default function AssetForm({ onClose }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(JSON.stringify({ name, type, status, file: file ? file.name : 'No file' }));
    onClose(); // Close the drawer after form submission
  };


  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: "20px",
        marginTop: "80px",
      }}
    >
      <Stack spacing={2}  // Apply spacing uniformly
      >
        <Typography variant="h6" gutterBottom>
          Add an Asset
        </Typography>
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Thumbnail"
            style={{ width: "100%", marginBottom: 16 }}
          />
        )}
        <label htmlFor="upload-button-file">
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput type="file" />
          </Button>
        </label>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            label="Type"
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="Character">Character</MenuItem>
            <MenuItem value="Environment">Environment</MenuItem>
            <MenuItem value="Prop">Prop</MenuItem>
            <MenuItem value="Reference">Reference</MenuItem>

          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="NotStarted">NotStarted</MenuItem>
            <MenuItem value="InProgress">InProgress</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </Stack>
    </form>
  );
}
