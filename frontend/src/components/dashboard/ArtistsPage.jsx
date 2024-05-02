import * as React from "react";
import { useTheme } from "@mui/material/styles";
import VirtualizedTable from "../VirtualizedTable";

export default function AssetPage() {
  const theme = useTheme();

  return (
    <div style={{ fontSize: '24px', color: theme.palette.text.primary }}>
      <div>
        Artists Page
      </div>
      <VirtualizedTable></VirtualizedTable> 

    </div>
  );
}