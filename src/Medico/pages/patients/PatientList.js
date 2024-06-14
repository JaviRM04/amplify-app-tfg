import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, Card, CardContent, Typography, Divider, Button, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import api from '../../../axiosConfig'; // Importa la instancia de Axios configurada
import { UserContext } from '../../../utils/UserContext';

function PatientList() {
    const { roleId } = useContext(UserContext);
    const [patients, setPatients] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const responseAppointments = await api.get('/appointments');
            const patientsFromAppointments = responseAppointments.data.filter(appointment => appointment.ProfesionalID === parseInt(roleId));
            
            const responsePatients = await api.get('/patients');
            const allPatients = responsePatients.data;
    
            const patientsCollection = allPatients.filter(patient => 
                patientsFromAppointments.some(appointment => appointment.PacienteID === patient.PacienteID)
            );
    
            console.log('El contenido de patients es:', patientsCollection);
            setPatients(patientsCollection);
        } catch (error) {
            console.error('There was an error fetching the patient data:', error);
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
                                <Typography variant="h6">Paciente ID: {patient.PacienteID}</Typography>
                                <Divider style={{ margin: '10px 0' }} />
                                <Typography variant="body2">DNI: {patient.DNI}</Typography>
                                <Typography variant="body2">Nombre: {patient.nombre}</Typography>
                                <Typography variant="body2">Fecha de Nacimiento: {patient.FechaNacimiento}</Typography>
                                <Typography variant="body2">Género: {patient.Genero}</Typography>
                                <Typography variant="body2">Grupo Sanguíneo: {patient.GrupoSanguineo}</Typography>
                                <Typography variant="body2">Teléfono: {patient.telefono}</Typography>
                                <Typography variant="body2">Email: {patient.email}</Typography>
                                <Typography variant="body2">Dirección: {patient.Direccion}</Typography>
                                <Typography variant="body2">Número de Seguridad Social: {patient.NumeroSeguridadSocial}</Typography>
                                <Typography variant="body2">Alergias: {patient.Alergias}</Typography>
                                <Typography variant="body2">Antecedentes Personales: {patient.AntecedentesPersonales}</Typography>
                                <Typography variant="body2">Antecedentes Familiares: {patient.AntecedentesFamiliares}</Typography>
                                <Typography variant="body2">Notas Médicas: {patient.NotasMedicas}</Typography>
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
