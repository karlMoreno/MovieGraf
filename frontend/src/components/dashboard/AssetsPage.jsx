import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export default function AssetPage() {
  const theme = useTheme();

  return (
    <div style={{ fontSize: '24px', color: theme.palette.text.primary }}>
      Hello World
    </div>
  );
}
