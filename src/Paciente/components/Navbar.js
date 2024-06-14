
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Sistema de Gestion de Datos Medicos
        </Typography>
        <Button color="inherit" component={Link} to="/">Inicio</Button>
        <Button color="inherit" component={Link} to="/profile">Perfil</Button>
        <Button color="inherit" component={Link} to="/appointments">Citas</Button>
        <Button color="inherit" component={Link} to="/blood-tests">Analisis de Sangre</Button>
        <Button color="inherit" component={Link} to="/medical-visits">Visitas Medicas</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
