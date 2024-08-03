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

export default function AssetForm({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      name,
      type,
      status,
      file
    };

    console.log("Form Data:", formData); // Log form data
    onSave(formData); // Pass form data to parent component
    onClose(); // Close the form
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

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
      <Stack spacing={2}>
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
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
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
