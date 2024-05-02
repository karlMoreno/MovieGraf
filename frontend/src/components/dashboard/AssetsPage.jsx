import * as React from "react";
import { useTheme } from "@mui/material/styles";
import VirtualizedTable from './VirtualizedTable';  // Adjust the import path as necessary


export default function AssetPage() {
  const theme = useTheme();

  return (
    <div style={{ fontSize: '24px', color: theme.palette.text.primary }}>
      Assets Page
      <div>
        <VirtualizedTable></VirtualizedTable>
      </div>
    </div>
    
  );
}
