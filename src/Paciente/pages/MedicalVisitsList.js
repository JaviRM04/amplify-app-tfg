import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, CircularProgress, List, ListItem, Card, CardContent, Divider, Snackbar, Box } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import moment from 'moment';
import { UserContext } from '../../utils/UserContext';
import api from '../../axiosConfig';

const MedicalVisitsList = () => {
    const { roleId } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);
    const [medicalVisits, setMedicalVisits] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseAppointments = await api.get('/appointments');
                const patientAppointments = responseAppointments.data.filter(appointment => appointment.PacienteID === parseInt(roleId));
                const appointmentIds = patientAppointments.map(appointment => appointment.CitaID);

                
                const responseMedicalVisits = await api.get('/medical-visits');
                const patientMedicalVisits = responseMedicalVisits.data.filter(visit => appointmentIds.includes(visit.CitaID));
                setMedicalVisits(patientMedicalVisits);

                
                const responsePrescriptions = await api.get('/prescriptions');
                const visitIds = patientMedicalVisits.map(visit => visit.VisitaID);
                const filteredPrescriptions = responsePrescriptions.data.filter(prescription => visitIds.includes(prescription.VisitaID));
                setPrescriptions(filteredPrescriptions);

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

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const getPrescriptionsForVisit = (visitId) => {
        return prescriptions.filter(prescription => prescription.VisitaID === visitId);
    };

    const formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY HH:mm');
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
                                <Typography variant="h6">Visita Médica : {formatDate(visit.FechaHora)}</Typography>
                                <Divider style={{ margin: '10px 0' }} />
                                <Typography variant="body2">Fecha y Hora: {formatDate(visit.FechaHora)}</Typography>
                                <Typography variant="body2">Motivo de la Consulta: {visit.MotivoConsulta}</Typography>
                                <Typography variant="body2">Diagnóstico: {visit.Diagnostico}</Typography>
                                <Typography variant="body2">Duración: {visit.Duracion}</Typography>
                                <Typography variant="body2">Notas: {visit.Notas}</Typography>
                                <Box mt={2}>
                                    <Typography variant="h6" gutterBottom>Prescripciones:</Typography>
                                    {getPrescriptionsForVisit(visit.VisitaID).map((prescription) => (
                                        <Box key={prescription.PrescripcionID} mb={2} p={2} border={1} borderRadius={8} borderColor="grey.400">
                                            <Typography variant="body2"><strong>Medicamento:</strong> {prescription.Medicamento}</Typography>
                                            <Typography variant="body2"><strong>Dosis:</strong> {prescription.Dosis}</Typography>
                                            <Typography variant="body2"><strong>Instrucciones:</strong> {prescription.Instrucciones}</Typography>
                                            <Typography variant="body2"><strong>Fecha de Prescripción:</strong> {formatDate(prescription.FechaPrescripcion)}</Typography>
                                            <Typography variant="body2"><strong>Fecha de Expiración:</strong> {formatDate(prescription.FechaExpiracion)}</Typography>
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
