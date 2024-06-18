import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Typography, Button, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import api from '../../../axiosConfig'; 
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

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



    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const events = appointments.map(appointment => ({
        id: appointment.CitaID,
        title: moment(appointment.FechaHora).format('DD/MM/YYYY HH:mm'),
        start: new Date(appointment.FechaHora),
        end: new Date(new Date(appointment.FechaHora).getTime() + 30 * 60000), // assuming each appointment lasts 30 minutes
        allDay: false
    }));

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h2" gutterBottom>
                Lista de Citas
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/appointments/new')} style={{ marginBottom: '20px' }}>
                Crear Nueva Cita
            </Button>
            <div style={{ height: '600px' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    onSelectEvent={event => navigate(`/appointments/edit/${event.id}`)}
                />
            </div>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}

export default AppointmentsList;
