import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';


export function MainListItems({ onNavigate }) {
  return (
    <React.Fragment>
      <ListItemButton onClick={() => onNavigate('dashboard')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      <ListItemButton onClick={() => onNavigate('artists')}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Artists" />
      </ListItemButton>

      <ListItemButton onClick={()=> onNavigate('assets')}>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Assets" />
      </ListItemButton>

      <ListItemButton onClick={() => onNavigate('tasks')}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Tasks" />
      </ListItemButton>
      <ListItemButton onClick={() => onNavigate('timeline')}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Timeline" />
      </ListItemButton>
      <ListItemButton onClick={() => onNavigate('model')}>
        <ListItemIcon>
          <ThreeDRotationIcon />
        </ListItemIcon>
        <ListItemText primary="Model" />
      </ListItemButton>
    </React.Fragment>
    
    
  );
}

export default MainListItems;

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      
    </ListSubheader>
    <ListItemButton>
     
    </ListItemButton>
  </React.Fragment>
);