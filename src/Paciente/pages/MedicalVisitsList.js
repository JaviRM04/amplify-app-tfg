import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, CircularProgress, List, ListItem, Card, CardContent, Divider, Snackbar, Box } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { UserContext } from '../../utils/UserContext';
import api from '../../axiosConfig'; // Importa la instancia de Axios configurada

const MedicalVisitsList = () => {
    const { roleId } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);
    const [medicalVisits, setMedicalVisits] = useState([]);
    const [professionals, setProfessionals] = useState([]);
    const [users, setUsers] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const appointmentsResponse = await api.get('/appointments');
                const professionalsResponse = await api.get('/health-professionals');
                const usersResponse = await api.get('/users');
                
                const patientAppointments = appointmentsResponse.data.filter(appointment => appointment.PacienteID === parseInt(roleId));
                setAppointments(patientAppointments);
                setProfessionals(professionalsResponse.data);
                setUsers(usersResponse.data);

                // Fetch medical visits and prescriptions associated with each appointment
                const visitPromises = patientAppointments.map(appointment => api.get(`/medical-visits?CitaID=${appointment.CitaID}`));
                const visitsResponses = await Promise.all(visitPromises);
                const visits = visitsResponses.map(response => response.data).flat();

                const prescriptionPromises = visits.map(visit => api.get(`/prescriptions?VisitaID=${visit.VisitaID}`));
                const prescriptionsResponses = await Promise.all(prescriptionPromises);
                const prescriptions = prescriptionsResponses.map(response => response.data).flat();

                setMedicalVisits(visits);
                setPrescriptions(prescriptions);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Error fetching data');
                setLoading(false);
                setSnackbarMessage('Error fetching data');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };

        fetchData();
    }, [roleId]);

    const getProfessionalName = (professionalId) => {
        const professional = professionals.find(prof => prof.ProfesionalID === professionalId);
        if (professional) {
            const user = users.find(user => user.UserID === professional.UserID);
            return user ? user.Nombre : 'Desconocido';
        }
        return 'Desconocido';
    };

    const getPrescriptionsForVisit = (visitId) => {
        return prescriptions.filter(prescription => prescription.VisitaID === visitId);
    };

    const getAppointmentDetails = (citaID) => {
        return appointments.find(appointment => appointment.CitaID === citaID) || {};
    };

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
                Lista de Visitas Médicas
            </Typography>
            <List>
                {medicalVisits.map((visit) => (
                    <ListItem key={visit.VisitaID} alignItems="flex-start">
                        <Card variant="outlined" style={{ width: '100%' }}>
                            <CardContent>
                                <Typography variant="h6">Visita Médica ID: {visit.VisitaID}</Typography>
                                <Divider style={{ margin: '10px 0' }} />
                                <Typography variant="body2">Fecha y Hora: {visit.FechaHora}</Typography>
                                <Typography variant="body2">Motivo de la Consulta: {visit.MotivoConsulta}</Typography>
                                <Typography variant="body2">Diagnóstico: {visit.Diagnostico}</Typography>
                                <Typography variant="body2">Duración: {visit.Duracion}</Typography>
                                <Typography variant="body2">Notas: {visit.Notas}</Typography>
                                <Typography variant="body2">Médico: {getProfessionalName(visit.ProfesionalID)}</Typography>
                                <Typography variant="body2">
                                    Cita Asociada ID: {visit.CitaID} (Fecha y Hora: {getAppointmentDetails(visit.CitaID).FechaHora})
                                </Typography>
                                <Box mt={2}>
                                    <Typography variant="h6" gutterBottom>Prescripciones:</Typography>
                                    {getPrescriptionsForVisit(visit.VisitaID).map((prescription) => (
                                        <Box key={prescription.PrescripcionID} mb={2} p={2} border={1} borderRadius={8} borderColor="grey.400">
                                            <Typography variant="body2"><strong>Medicamento:</strong> {prescription.Medicamento}</Typography>
                                            <Typography variant="body2"><strong>Dosis:</strong> {prescription.Dosis}</Typography>
                                            <Typography variant="body2"><strong>Instrucciones:</strong> {prescription.Instrucciones}</Typography>
                                            <Typography variant="body2"><strong>Fecha de Prescripción:</strong> {prescription.FechaPrescripcion}</Typography>
                                            <Typography variant="body2"><strong>Fecha de Expiración:</strong> {prescription.FechaExpiracion}</Typography>
                                            <Typography variant="body2"><strong>Estado:</strong> {prescription.Estado}</Typography>
                                        </Box>
                                    ))}
                                </Box>
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

export default MedicalVisitsList;
