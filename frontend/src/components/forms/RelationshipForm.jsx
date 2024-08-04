import React, { useState } from "react";
import { Button, FormControl, InputLabel, Select, MenuItem, Typography, Stack } from "@mui/material";

const relationships = [
  "Asset",
  "CreativeWork",
  "NarrativeScene",
  "Task",
  "Participant"
];

const RelationshipForm = ({ onClose, onSave }) => {
  const [relationshipType, setRelationshipType] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(relationshipType);
    onClose();
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
          Create Relationship
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Relationship Type</InputLabel>
          <Select
            value={relationshipType}
            label="Relationship Type"
            onChange={(e) => setRelationshipType(e.target.value)}
          >
            {relationships.map((relationship) => (
              <MenuItem key={relationship} value={relationship}>
                {relationship}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </Stack>
    </form>
  );
};

export default RelationshipForm;
