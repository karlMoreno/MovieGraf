import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';

export default function SwipeableTemporaryDrawer({ contentComponent, open, onClose }) {
  return (
    <div>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={onClose}
        onOpen={() => {}}
      >
        <Box
          sx={{ width: 450 }}
          role="presentation"
          onClick={(event) => event.stopPropagation()}
        >
          {React.cloneElement(contentComponent, { onClose })}
        </Box>
      </SwipeableDrawer>
    </div>
  );
}
