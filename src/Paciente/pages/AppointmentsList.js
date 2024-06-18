import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../utils/UserContext';
import { Container, Typography, CircularProgress, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import api from '../../axiosConfig'; 
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const AppointmentsList = () => {
    const { roleId } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await api.get('/appointments');
                const filteredAppoint = response.data.filter(test => test.PacienteID === parseInt(roleId));
                setAppointments(filteredAppoint);
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

    const events = appointments.map(appointment => ({
        id: appointment.CitaID,
        title: moment(appointment.FechaHora).format('DD/MM/YYYY HH:mm'),
        start: new Date(appointment.FechaHora),
        end: new Date(new Date(appointment.FechaHora).getTime() + 30 * 60000), 
        allDay: false
    }));

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Lista de Citas
            </Typography>
            <div style={{ height: '600px' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                />
            </div>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
};

export default AppointmentsList;
