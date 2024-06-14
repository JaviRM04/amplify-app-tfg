import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../axiosConfig'; // Importa la instancia de Axios configurada
import { Container, TextField, Button, Typography, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const NewPatientForm = () => {
    const [patient, setPatient] = useState({
        DNI: '',
        Nombre: '',
        FechaNacimiento: '',
        Género: '',
        GrupoSanguíneo: '',
        Teléfono: '',
        Email: '',
        Dirección: '',
        NumeroSeguridadSocial: '',
        Alergias: '',
        AntecedentesPersonales: '',
        AntecedentesFamiliares: '',
        NotasMedicas: ''
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatient({
            ...patient,
            [name]: value
        });
    };

    const handleSave = async () => {
        try {
            await api.post('/patients', patient, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setSnackbarMessage('Paciente creado con éxito');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate('/patients');
            }, 2000);
        } catch (error) {
            console.error('Error creando paciente:', error);
            setSnackbarMessage('Error creando el paciente');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Crear Nuevo Paciente
            </Typography>
            <TextField
                label="DNI"
                name="DNI"
                value={patient.DNI}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Nombre"
                name="Nombre"
                value={patient.Nombre}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Fecha de Nacimiento"
                name="FechaNacimiento"
                type="date"
                value={patient.FechaNacimiento}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                label="Género"
                name="Género"
                value={patient.Género}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Grupo Sanguíneo"
                name="GrupoSanguíneo"
                value={patient.GrupoSanguíneo}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Teléfono"
                name="Teléfono"
                value={patient.Teléfono}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
                name="Email"
                value={patient.Email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Dirección"
                name="Dirección"
                value={patient.Dirección}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Número de Seguridad Social"
                name="NumeroSeguridadSocial"
                value={patient.NumeroSeguridadSocial}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Alergias"
                name="Alergias"
                value={patient.Alergias}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Antecedentes Personales"
                name="AntecedentesPersonales"
                value={patient.AntecedentesPersonales}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Antecedentes Familiares"
                name="AntecedentesFamiliares"
                value={patient.AntecedentesFamiliares}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Notas Médicas"
                name="NotasMedicas"
                value={patient.NotasMedicas}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '10px' }}>
                Guardar
            </Button>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
};

export default NewPatientForm;
