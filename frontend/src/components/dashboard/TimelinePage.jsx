import React from 'react';
import { useTheme } from "@mui/material/styles";
import TimelinePage from '../forms/TimelineForm'; 

function App() {
    const theme = useTheme();
  return (
    <div className="App">
        <div style={{ fontSize: '24px', color: theme.palette.text.primary }}>
        Timeline Page
      </div>
        
      <TimelinePage />
    </div>
  );
}

export default App;
