import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../utils/UserContext';
import { List, ListItem, Card, CardContent, Typography, Divider, Container, CircularProgress, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import api from '../../axiosConfig'; // Importa la instancia de Axios configurada

const AppointmentsList = () => {
    const { roleId } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [filteredAppointments, setFilteredAppointments] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await api.get('/appointments');
                const filteredAppoint = response.data.filter(test => test.PacienteID === parseInt(roleId));
                setFilteredAppointments(filteredAppoint);
                setAppointments(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError('Error fetching appointments');
                setLoading(false);
                setSnackbarMessage('Error fetching appointments');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };

        fetchAppointments();
    }, [roleId]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Lista de Citas
            </Typography>
            <List>
                {filteredAppointments.map((appointment) => (
                    <ListItem key={appointment.CitaID} alignItems="flex-start">
                        <Card variant="outlined" style={{ width: '100%' }}>
                            <CardContent>
                                <Typography variant="h6">Cita ID: {appointment.CitaID}</Typography>
                                <Divider style={{ margin: '10px 0' }} />
                                <Typography variant="body2">Fecha y Hora: {appointment.FechaHora}</Typography>
                                <Typography variant="body2">Estado: {appointment.Estado}</Typography>
                                <Typography variant="body2">Notas: {appointment.Notas}</Typography>
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
        </Container>
    );
};

export default AppointmentsList;
