import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

const PatientForm = ({ onSubmit, userId }) => {
  const [formData, setFormData] = useState({
    UserID: userId,
    DNI: '',
    FechaNacimiento: '',
    Genero: '',
    Direccion: '',
    NumeroSeguridadSocial: '',
    Alergias: '',
    GrupoSanguineo: '',
    AntecedentesFamiliares: '',
    AntecedentesPersonales: '',
    NotasMedicas: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
          Completa los datos del Paciente
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            name="DNI"
            label="DNI"
            fullWidth
            value={formData.DNI}
            onChange={handleChange}
            required
          />
          <TextField
            name="FechaNacimiento"
            label="Fecha de Nacimiento"
            type="date"
            fullWidth
            value={formData.FechaNacimiento}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="Genero"
            label="Género"
            fullWidth
            value={formData.Genero}
            onChange={handleChange}
            required
          />
          <TextField
            name="Direccion"
            label="Dirección"
            fullWidth
            value={formData.Direccion}
            onChange={handleChange}
            required
          />
          <TextField
            name="NumeroSeguridadSocial"
            label="Número de Seguridad Social"
            fullWidth
            value={formData.NumeroSeguridadSocial}
            onChange={handleChange}
            required
          />
          <TextField
            name="Alergias"
            label="Alergias"
            fullWidth
            value={formData.Alergias}
            onChange={handleChange}
            required
          />
          <TextField
            name="GrupoSanguineo"
            label="Grupo Sanguíneo"
            fullWidth
            value={formData.GrupoSanguineo}
            onChange={handleChange}
            required
          />
          <TextField
            name="AntecedentesFamiliares"
            label="Antecedentes Familiares"
            fullWidth
            value={formData.AntecedentesFamiliares}
            onChange={handleChange}
            required
          />
          <TextField
            name="AntecedentesPersonales"
            label="Antecedentes Personales"
            fullWidth
            value={formData.AntecedentesPersonales}
            onChange={handleChange}
            required
          />
          <TextField
            name="NotasMedicas"
            label="Notas Médicas"
            fullWidth
            value={formData.NotasMedicas}
            onChange={handleChange}
            required
          />
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

export default PatientForm;
