import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../axiosConfig'; 
import { List, ListItem, Card, CardContent, Typography, Divider, Button, Snackbar, useRadioGroup } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

function PatientList() {
    const [patients, setPatients] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatientsAndUsers();
    }, []);

    const fetchPatientsAndUsers = async () => {
        try {
            const patientsResponse = await api.get('/patients');
            
            const usersResponse = await api.get('/users');
            const patientsData = patientsResponse.data;
            const usersData = usersResponse.data.filter(user => user.Rol === 'Paciente');
           
            const combinedData = patientsData.map(patient => {
                const user = usersData.find(user => user.UserID === patient.UserID);
                return { 
                    ...patient, 
                    Nombre: user ? user.Nombre : null,
                    Email: user ? user.Email : null,
                    Teléfono: user ? user.Teléfono : null,
                    Dirección: user ? user.Dirección : null,
                    FechaRegistro: user ? user.FechaRegistro : null
                };
            });
           
            setPatients(combinedData);
        } catch (error) {
            console.error('There was an error fetching the patient and user data:', error);
            setSnackbarMessage('Error fetching patient and user data');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

 

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h2" gutterBottom>
                Lista de Pacientes
            </Typography>
            <List>
                {patients.map((patient) => (
                    <ListItem key={patient.PacienteID} alignItems="flex-start">
                        <Card variant="outlined" style={{ width: '100%' }}>
                            <CardContent>
                                <Typography variant="h6">Paciente : {patient.Nombre || patient.nombre}</Typography>
                                <Divider style={{ margin: '10px 0' }} />
                                <Typography variant="body2">DNI: {patient.DNI}</Typography>
                                <Typography variant="body2">Nombre: {patient.Nombre || patient.nombre}</Typography>
                                <Typography variant="body2">Fecha de Nacimiento: {patient.FechaNacimiento}</Typography>
                                <Typography variant="body2">Género: {patient.Genero}</Typography>
                                <Typography variant="body2">Grupo Sanguíneo: {patient.GrupoSanguineo}</Typography>
                                <Typography variant="body2">Teléfono: {patient.Teléfono || patient.telefono}</Typography>
                                <Typography variant="body2">Email: {patient.Email || patient.email}</Typography>
                                <Typography variant="body2">Dirección: {patient.Dirección || patient.Direccion}</Typography>
                                <Typography variant="body2">Número de Seguridad Social: {patient.NumeroSeguridadSocial}</Typography>
                                <Typography variant="body2">Alergias: {patient.Alergias}</Typography>
                                <Typography variant="body2">Antecedentes Personales: {patient.AntecedentesPersonales}</Typography>
                                <Typography variant="body2">Antecedentes Familiares: {patient.AntecedentesFamiliares}</Typography>
                                <Typography variant="body2">Notas Médicas: {patient.NotasMedicas}</Typography>
                                <Typography variant="body2">Fecha de Registro: {patient.FechaRegistro}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: '10px', marginRight: '10px' }}
                                    onClick={() => navigate(`/patient/${patient.PacienteID}`)}
                                >
                                    Ver Perfil
                                </Button>
                            </CardContent>
                        </Card>
                    </ListItem>
                ))}
            </List>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}

export default PatientList;
