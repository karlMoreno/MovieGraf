import * as React from "react";
import { useTheme } from "@mui/material/styles";
import SwipeableTemporaryDrawer from '../SwipeableTemporaryDrawer';
import AssetForm from '../forms/AssetForm';
import FullFeaturedCrudGrid from '../FullFeaturedCrudGrid';  // Import the new CRUD table

export default function AssetPage() {
  const theme = useTheme();

  return (
    <div>
      <div style={{ fontSize: '24px', color: theme.palette.text.primary }}>
        Assets Page
      </div>
      <SwipeableTemporaryDrawer contentComponent={<AssetForm />} />
      <FullFeaturedCrudGrid />  // Use the new CRUD table
    </div>
  );
}
