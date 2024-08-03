// RelationshipForm.jsx
import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const RelationshipForm = ({ onSubmit }) => {
  const [relationshipType, setRelationshipType] = useState('');
  const [relationshipProperties, setRelationshipProperties] = useState('');

  const handleSubmit = () => {
    onSubmit({
      type: relationshipType,
      properties: JSON.parse(relationshipProperties || '{}')
    });
  };

  return (
    <Dialog open={true} onClose={() => onSubmit(null)}>
      <DialogTitle>Define Relationship</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Relationship Type"
          fullWidth
          value={relationshipType}
          onChange={(e) => setRelationshipType(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Relationship Properties (JSON)"
          fullWidth
          value={relationshipProperties}
          onChange={(e) => setRelationshipProperties(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onSubmit(null)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RelationshipForm;
