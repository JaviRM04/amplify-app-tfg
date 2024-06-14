// En src/components/Navbar.js
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
        <Button color="inherit" component={Link} to="/patients">Lista de Pacientes</Button>
        <Button color="inherit" component={Link} to="/users">Lista de Usuarios</Button>
        <Button color="inherit" component={Link} to="/appointments">Citas</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
