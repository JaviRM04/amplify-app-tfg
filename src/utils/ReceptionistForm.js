import React, { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

const ReceptionistForm = ({ onSubmit, userId }) => {
  const [formData, setFormData] = useState({
    UserID: userId,
    Oficina: '',
    Notas: '',
    Turno: '',
    Departamento: 'Recepción',
    Estado: 'Activo',
    Salario: '',
  });

  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      UserID: userId
    }));
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
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
          Registro de Recepcionista
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            name="Oficina"
            label="Oficina"
            fullWidth
            value={formData.Oficina}
            onChange={handleChange}
            required
          />
          <TextField
            name="Notas"
            label="Notas"
            fullWidth
            value={formData.Notas}
            onChange={handleChange}
            required
          />
          <TextField
            name="Turno"
            label="Turno"
            fullWidth
            value={formData.Turno}
            onChange={handleChange}
            required
          />
          <TextField
            name="Salario"
            label="Salario"
            type="number"
            fullWidth
            value={formData.Salario}
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

export default ReceptionistForm;
