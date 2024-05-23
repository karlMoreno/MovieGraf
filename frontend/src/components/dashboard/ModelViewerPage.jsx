import React from 'react';
import ModelViewForm from '../forms/ModelViewForm'; // Assuming ThreeDViewer is the default export from ModelViewForm.jsx
import { useTheme } from "@mui/material/styles";

function App() {
  const theme = useTheme();

  return (
    <div className="App">
      <div style={{ fontSize: '24px', color: theme.palette.text.primary }}>
        Model Viewer Page
      </div>
      <ModelViewForm />  // This should match the name used in the import if this is the viewer component
    </div>
  );
}

export default ModelViewForm;