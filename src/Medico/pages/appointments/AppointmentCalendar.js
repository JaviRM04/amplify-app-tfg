import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../../../axiosConfig'; 
import { UserContext } from '../../../utils/UserContext';

const localizer = momentLocalizer(moment);

const AppointmentsCalendar = () => {
    const { roleId } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            let appointments = response.data.filter(test => test.ProfesionalID === parseInt(roleId));
            appointments.sort((a, b) => new Date(b.FechaHora) - new Date(a.FechaHora));
            setAppointments(appointments);
        } catch (error) {
            console.error('There was an error fetching the appointments data:', error);
        }
    };

    const events = appointments.map(appointment => ({
        id: appointment.CitaID,
        title: moment(appointment.FechaHora).format('DD/MM/YYYY HH:mm'),
        start: new Date(appointment.FechaHora),
        end: new Date(new Date(appointment.FechaHora).getTime() + 30 * 60000),
        allDay: false
    }));

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h2" gutterBottom>
                Calendario de Citas
            </Typography>
            <div style={{ height: '600px', marginBottom: '20px' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    onSelectEvent={(event) => navigate(`/appointments/details/${event.id}`)}
                />
            </div>
        </div>
    );
};

export default AppointmentsCalendar;
