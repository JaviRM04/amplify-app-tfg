import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Snackbar, Typography, Box } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import api from '../axiosConfig'; // Importa la instancia de Axios configurada
import { UserContext } from './UserContext';  

function HealthMedicalForm() {
    const { userId } = useContext(UserContext);
    const [healthProfessional, setHealthProfessional] = useState({
        UserID: userId,
        Especialidad: '',
        NumeroLicencia: '',
        Departamento: '',
        FechaContratacion: '',
        Estado: 'Activo',
        Salario: ''
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHealthProfessional({
            ...healthProfessional,
            [name]: value
        });
    };

    const handleSave = () => {
        api.post('/health-professionals', healthProfessional)
            .then(response => {
                setSnackbarMessage('Profesional de salud creado con éxito');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            })
            .catch(err => {
                console.error('Error creando el profesional de salud:', err);
                setSnackbarMessage('Error creando el profesional de salud');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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
                    Crear Profesional de Salud
                </Typography>
                <Box component="form" onSubmit={handleSave} sx={{ mt: 3 }}>
                    <TextField
                        name="Especialidad"
                        label="Especialidad"
                        fullWidth
                        value={healthProfessional.Especialidad}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                    />
                    <TextField
                        name="NumeroLicencia"
                        label="Número de Licencia"
                        fullWidth
                        value={healthProfessional.NumeroLicencia}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                    />
                    <TextField
                        name="Departamento"
                        label="Departamento"
                        fullWidth
                        value={healthProfessional.Departamento}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                    />
                    <TextField
                        name="FechaContratacion"
                        label="Fecha de Contratación"
                        type="date"
                        fullWidth
                        value={healthProfessional.FechaContratacion}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        name="Estado"
                        label="Estado"
                        fullWidth
                        value={healthProfessional.Estado}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                    />
                    <TextField
                        name="Salario"
                        label="Salario"
                        type="number"
                        fullWidth
                        value={healthProfessional.Salario}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                    />
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleSave}
                    >
                        Guardar
                    </Button>
                </Box>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
}

export default HealthMedicalForm;
