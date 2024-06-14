
import React from 'react';
import { Typography, Box } from '@mui/material';

function Footer() {
  return (
    <Box mt={8} py={3} textAlign="center" bgcolor="primary.main" color="white">
      <Typography variant="subtitle1">
        © 2024 Medical Management System. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
