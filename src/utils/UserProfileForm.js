import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const UserProfileForm = ({ onSubmit, user }) => {
  const [profileData, setProfileData] = useState({
    Nombre: '',
    Email: '',
    Teléfono: '',
    Dirección: '',
    Rol: 'Paciente', 
    FechaRegistro: new Date().toISOString().split('T')[0],
    amplifyId: user.userId
  });

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(profileData);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Completa tu perfil
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            name="Nombre"
            label="Nombre"
            fullWidth
            value={profileData.Nombre}
            onChange={handleChange}
            required
          />
          <TextField
            name="Email"
            label="Email"
            fullWidth
            value={profileData.Email}
            onChange={handleChange}
            required
          />
          <TextField
            name="Teléfono"
            label="Teléfono"
            fullWidth
            value={profileData.Teléfono}
            onChange={handleChange}
            required
          />
          <TextField
            name="Dirección"
            label="Dirección"
            fullWidth
            value={profileData.Dirección}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth required sx={{ mt: 3, mb: 2 }}>
            <InputLabel id="rol-label">Rol</InputLabel>
            <Select
              labelId="rol-label"
              name="Rol"
              value={profileData.Rol}
              onChange={handleChange}
              label="Rol"
            >
              <MenuItem value="Medico">Médico</MenuItem>
              <MenuItem value="Paciente">Paciente</MenuItem>
              <MenuItem value="Recepcionista">Recepcionista</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Guardar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserProfileForm;
