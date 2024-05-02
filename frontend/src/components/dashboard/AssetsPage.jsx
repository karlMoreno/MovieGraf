import * as React from "react";
import { useTheme } from "@mui/material/styles";
import VirtualizedTable from '../VirtualizedTable';  // Adjust the import path as necessary
import AnchorButton from '../AnchorButton'

export default function AssetPage() {
  const theme = useTheme();

  return (
    <div>
      <div style={{ fontSize: '24px', color: theme.palette.text.primary }}>
        Assets Page
      </div>
      <AnchorButton></AnchorButton>
      <VirtualizedTable></VirtualizedTable> // Using the table component here
    </div>
    
  );
}
