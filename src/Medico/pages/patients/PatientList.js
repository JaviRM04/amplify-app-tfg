import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, Card, CardContent, Typography, Divider, Button, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import api from '../../../axiosConfig';
import { UserContext } from '../../../utils/UserContext';

function PatientList() {
    const { roleId } = useContext(UserContext);
    const [patients, setPatients] = useState([]);
    const [users, setUsers] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const [responseAppointments, responsePatients, responseUsers] = await Promise.all([
                api.get('/appointments'),
                api.get('/patients'),
                api.get('/users')
            ]);

            const patientsFromAppointments = responseAppointments.data.filter(appointment => appointment.ProfesionalID === parseInt(roleId));
            const allPatients = responsePatients.data;
            const allUsers = responseUsers.data;

            const patientsCollection = allPatients.filter(patient =>
                patientsFromAppointments.some(appointment => appointment.PacienteID === patient.PacienteID)
            );

            
            const joinedPatients = patientsCollection.map(patient => {
                const user = allUsers.find(user => user.UserID === patient.UserID);
                return {
                    ...patient,
                    Nombre: user ? user.Nombre : '',
                    Email: user ? user.Email : '',
                    Teléfono: user ? user.Teléfono : '',
                    Dirección: user ? user.Dirección : '',
                    FechaRegistro: user ? user.FechaRegistro : ''
                };
            });

            console.log('El contenido de patients es:', joinedPatients);
            setPatients(joinedPatients);
        } catch (error) {
            console.error('There was an error fetching the patient data:', error);
            setSnackbarMessage('Error fetching patient data');
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
                                <Typography variant="h6">Paciente : {patient.Nombre}</Typography>
                                <Divider style={{ margin: '10px 0' }} />
                                <Typography variant="body2">DNI: {patient.DNI}</Typography>
                                <Typography variant="body2">Nombre: {patient.Nombre}</Typography>
                                <Typography variant="body2">Fecha de Nacimiento: {patient.FechaNacimiento}</Typography>
                                <Typography variant="body2">Género: {patient.Genero}</Typography>
                                <Typography variant="body2">Grupo Sanguíneo: {patient.GrupoSanguineo}</Typography>
                                <Typography variant="body2">Teléfono: {patient.Teléfono}</Typography>
                                <Typography variant="body2">Email: {patient.Email}</Typography>
                                <Typography variant="body2">Dirección: {patient.Dirección}</Typography>
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
