import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../axiosConfig'; 
import { Card, CardContent, Typography, CircularProgress, Container, TextField, Button, List, ListItem, Divider, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

function PatientProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const patientResponse = await api.get(`/patients/${id}`);
                const appointmentsResponse = await api.get(`/appointments`);
                setPatient(patientResponse.data);
                setAppointments(appointmentsResponse.data.filter(appointment => appointment.PacienteID === parseInt(id)));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatient({
            ...patient,
            [name]: value
        });
    };

    const handleSave = () => {
        setLoading(true);
        api.put(`/patients/${id}`, patient)
        .then(response => {
            setIsEditing(false);
            setLoading(false);
            setSnackbarMessage('Paciente actualizado con éxito');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        })
        .catch(err => {
            console.error('Error updating patient details:', err);
            setError('Error updating patient details');
            setLoading(false);
            setSnackbarMessage('Error actualizando el paciente');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        });
    };

    const handleDeleteAppointment = async (appointmentId) => {
        try {
            await api.delete(`/appointments/${appointmentId}`);
            setSnackbarMessage('Cita eliminada con éxito');
            setSnackbarSeverity('success');
            setAppointments(appointments.filter(appointment => appointment.CitaID !== appointmentId));
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
            <Card raised>
                <CardContent>
                    <Typography variant="h4" gutterBottom>Perfil del Paciente</Typography>
                    {patient ? (
                        <>
                            {isEditing ? (
                                <>
                                    <TextField
                                        label="DNI"
                                        name="DNI"
                                        value={patient.DNI}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Fecha de Nacimiento"
                                        name="FechaNacimiento"
                                        type="date"
                                        value={patient.FechaNacimiento}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        label="Género"
                                        name="Genero"
                                        value={patient.Genero}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Dirección"
                                        name="Direccion"
                                        value={patient.Direccion}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Número de Seguridad Social"
                                        name="NumeroSeguridadSocial"
                                        value={patient.NumeroSeguridadSocial}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Grupo Sanguíneo"
                                        name="GrupoSanguineo"
                                        value={patient.GrupoSanguineo}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Alergias"
                                        name="Alergias"
                                        value={patient.Alergias}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Antecedentes Personales"
                                        name="AntecedentesPersonales"
                                        value={patient.AntecedentesPersonales}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Antecedentes Familiares"
                                        name="AntecedentesFamiliares"
                                        value={patient.AntecedentesFamiliares}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Notas Médicas"
                                        name="NotasMedicas"
                                        value={patient.NotasMedicas}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '10px' }}>
                                        Guardar
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6">DNI: {patient.DNI}</Typography>
                                    <Typography color="textSecondary">Fecha de Nacimiento: {patient.FechaNacimiento}</Typography>
                                    <Typography color="textSecondary">Género: {patient.Genero}</Typography>
                                    <Typography color="textSecondary">Dirección: {patient.Direccion}</Typography>
                                    <Typography color="textSecondary">Número de Seguridad Social: {patient.NumeroSeguridadSocial}</Typography>
                                    <Typography color="textSecondary">Grupo Sanguíneo: {patient.GrupoSanguineo}</Typography>
                                    <Typography color="textSecondary">Alergias: {patient.Alergias}</Typography>
                                    <Typography color="textSecondary">Antecedentes Personales: {patient.AntecedentesPersonales}</Typography>
                                    <Typography color="textSecondary">Antecedentes Familiares: {patient.AntecedentesFamiliares}</Typography>
                                    <Typography color="textSecondary">Notas Médicas: {patient.NotasMedicas}</Typography>
                                    <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} style={{ marginTop: '10px' }}>
                                        Editar
                                    </Button>
                                </>
                            )}
                        </>
                    ) : (
                        <Typography color="textSecondary">No se encontraron detalles para el paciente con ID {id}.</Typography>
                    )}
                </CardContent>
            </Card>

            <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
                Citas Asociadas
            </Typography>
            <Button
                variant="contained"
                color="primary"
                style={{ marginBottom: '20px' }}
                onClick={() => navigate(`/appointments/new?patientId=${id}`)}
            >
                Crear Nueva Cita
            </Button>
            <List>
                {appointments.map((appointment) => (
                    <ListItem key={appointment.CitaID} alignItems="flex-start">
                        <Card variant="outlined" style={{ width: '100%' }}>
                            <CardContent>
                                <Typography variant="h6">Cita ID: {appointment.CitaID}</Typography>
                                <Divider style={{ margin: '10px 0' }} />
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
                                    onClick={() => handleDeleteAppointment(appointment.CitaID)}
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
        </Container>
    );
}

export default PatientProfile;
