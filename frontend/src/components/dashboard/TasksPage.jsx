import * as React from "react";
import { useTheme } from "@mui/material/styles";
import SwipeableTemporaryDrawer from '../SwipeableTemporaryDrawer';
import TasksCrudGrid from "../TasksCrudGrid";
import TasksForm from '../forms/TasksForm';

export default function TasksPage() {
  const theme = useTheme();

  return (
    <div>
      <div style={{ fontSize: '24px', color: theme.palette.text.primary }}>
        Tasks Page
      </div>
      <SwipeableTemporaryDrawer contentComponent={<TasksForm />} />
      <TasksCrudGrid />
    </div>
  );
}
