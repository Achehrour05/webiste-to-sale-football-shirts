import * as React from 'react';
import Button from '@mui/material/Button';

export default function DisableElevation() {
  return (
    <Button variant="contained" 
    disableElevation
    sx={{ width: '170px' }} 
    >
      Save & Continue
    </Button>
  );
}
