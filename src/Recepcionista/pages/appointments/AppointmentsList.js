import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, Card, CardContent, Typography, Divider, Button, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import api from '../../../axiosConfig'; // Importa la instancia de Axios configurada

function AppointmentsList() {
    const [appointments, setAppointments] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('There was an error fetching the appointments data:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/appointments/${id}`);
            setSnackbarMessage('Cita eliminada con éxito');
            setSnackbarSeverity('success');
            fetchAppointments();
        } catch (error) {
            console.error('Error deleting appointment:', error);
            setSnackbarMessage('Error eliminando la cita');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h2" gutterBottom>
                Lista de Citas
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/appointments/new')}>
                Crear Nueva Cita
            </Button>
            <List>
                {appointments.map((appointment) => (
                    <ListItem key={appointment.CitaID} alignItems="flex-start">
                        <Card variant="outlined" style={{ width: '100%' }}>
                            <CardContent>
                                <Typography variant="h6">Cita ID: {appointment.CitaID}</Typography>
                                <Divider style={{ margin: '10px 0' }} />
                                <Typography variant="body2">Paciente ID: {appointment.PacienteID}</Typography>
                                <Typography variant="body2">Recepcionista ID: {appointment.RecepcionistaID}</Typography>
                                <Typography variant="body2">Profesional ID: {appointment.ProfesionalID}</Typography>
                                <Typography variant="body2">Fecha y Hora: {appointment.FechaHora}</Typography>
                                <Typography variant="body2">Estado: {appointment.Estado}</Typography>
                                <Typography variant="body2">Notas: {appointment.Notas}</Typography>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    style={{ marginTop: '10px', marginRight: '10px' }}
                                    onClick={() => navigate(`/appointments/edit/${appointment.CitaID}`)}
                                >
                                    Editar
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    style={{ marginTop: '10px' }}
                                    onClick={() => handleDelete(appointment.CitaID)}
                                >
                                    Borrar
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

export default AppointmentsList;
