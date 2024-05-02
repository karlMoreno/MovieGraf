import * as React from "react";
import { useTheme } from "@mui/material/styles";
import SwipeableTemporaryDrawer from '../SwipeableTemporaryDrawer'
import VirtualizedTable from "../VirtualizedTable";


export default function AssetPage() {
  const theme = useTheme();

  return (
    <div>
      <div style={{ fontSize: '24px', color: theme.palette.text.primary }}>
        Tasks Page
      </div>
      {/* <SwipeableTemporaryDrawer></SwipeableTemporaryDrawer> */}
      <VirtualizedTable></VirtualizedTable> 
    </div>
  );
}