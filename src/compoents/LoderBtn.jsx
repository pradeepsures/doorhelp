import * as React from 'react';
import { Stack, CircularProgress } from '@mui/material';

export default function CircularSize() {
  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <CircularProgress size="20px"   />
    
    </Stack>
  );
}