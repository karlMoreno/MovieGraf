import * as React from "react";
import { useTheme } from "@mui/material/styles";
import VirtualizedTable from '../VirtualizedTable';  
import SwipeableTemporaryDrawer from '../SwipeableTemporaryDrawer'
import AssetForm from '../assets/AssetForm';



export default function AssetPage() {
  const theme = useTheme();

  return (
    <div>
      <div style={{ fontSize: '24px', color: theme.palette.text.primary }}>
        Assets Page
      </div>
      <SwipeableTemporaryDrawer contentComponent={<AssetForm />} />

      <VirtualizedTable></VirtualizedTable> 
    </div>
    
  );
}
