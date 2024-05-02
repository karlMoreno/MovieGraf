import * as React from "react";
import { useTheme } from "@mui/material/styles";


export default function AssetPage() {
  const theme = useTheme();

  return (
    <div style={{ fontSize: '24px', color: theme.palette.text.primary }}>
      Artists Page
    </div>
  );
}