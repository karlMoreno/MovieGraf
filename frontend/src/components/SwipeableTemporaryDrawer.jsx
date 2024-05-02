import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';

export default function SwipeableTemporaryDrawer({ contentComponent }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setIsOpen(open);
  };

  return (
    <div>
      <Button variant="contained" startIcon={<AddBoxIcon />} onClick={toggleDrawer(true)}>
        Add
      </Button>
      <SwipeableDrawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box
          sx={{ width: 450 }}
          role="presentation"
          onClick={(event) => event.stopPropagation()}
        >
          {React.cloneElement(contentComponent, { onClose: toggleDrawer(false) })}
        </Box>
      </SwipeableDrawer>
    </div>
  );
}
