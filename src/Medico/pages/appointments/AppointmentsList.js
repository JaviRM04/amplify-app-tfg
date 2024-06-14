import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, Card, CardContent, Typography, Divider, Button, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import api from '../../../axiosConfig'; // Importa la instancia de Axios configurada
import { UserContext } from '../../../utils/UserContext';

function AppointmentsList() {
    const { roleId } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [medicalVisit, setMedicalVisit] = useState({ CitaID: '', FechaHora: '', MotivoConsulta: '', Diagnostico: '', Notas: '', Duracion: '' });
    const [prescriptions, setPrescriptions] = useState([]);
    const [visitDialogOpen, setVisitDialogOpen] = useState(false);
    const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
    const [newPrescription, setNewPrescription] = useState({ Medicamento: '', Dosis: '', Instrucciones: '', FechaPrescripcion: '', FechaExpiracion: '', Estado: '' });

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

    const fetchMedicalVisit = async (appointmentId) => {
        try {
            const response = await api.get(`/medical-visits?CitaID=${appointmentId}`);
            if (response.data.length > 0) {
                const visit = response.data[0];
                setMedicalVisit(visit);
                fetchPrescriptions(visit.VisitaID);
            } else {
                setMedicalVisit({ CitaID: appointmentId, FechaHora: '', MotivoConsulta: '', Diagnostico: '', Notas: '', Duracion: '' });
                setPrescriptions([]);
            }
        } catch (error) {
            console.error('There was an error fetching the medical visit data:', error);
        }
    };

    const fetchPrescriptions = async (visitId) => {
        try {
            const response = await api.get(`/prescriptions?VisitaID=${visitId}`);
            setPrescriptions(response.data);
        } catch (error) {
            console.error('There was an error fetching the prescriptions data:', error);
        }
    };

    const handleCreateMedicalVisit = async () => {
        try {
            const response = await api.post('/medical-visits', { ...medicalVisit, FechaHora: new Date().toISOString() });
            const createdVisit = response.data;
            setMedicalVisit(createdVisit);
            setSnackbarMessage('Visita médica creada exitosamente');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            fetchMedicalVisit(createdVisit.CitaID);
        } catch (error) {
            console.error('There was an error creating the medical visit:', error);
            setSnackbarMessage('Error al crear la visita médica');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleUpdateMedicalVisit = async () => {
        try {
            await api.put(`/medical-visits/${medicalVisit.VisitaID}`, medicalVisit);
            setSnackbarMessage('Visita médica actualizada exitosamente');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            fetchMedicalVisit(medicalVisit.CitaID);
        } catch (error) {
            console.error('There was an error updating the medical visit:', error);
            setSnackbarMessage('Error al actualizar la visita médica');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleDeleteMedicalVisit = async () => {
        try {
            await api.delete(`/medical-visits/${medicalVisit.VisitaID}`);
            setMedicalVisit({ CitaID: '', FechaHora: '', MotivoConsulta: '', Diagnostico: '', Notas: '', Duracion: '' });
            setPrescriptions([]);
            setSnackbarMessage('Visita médica y prescripciones asociadas eliminadas exitosamente');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('There was an error deleting the medical visit:', error);
            setSnackbarMessage('Error al eliminar la visita médica');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleCreatePrescription = async () => {
        try {
            const { Medicamento, Dosis, Instrucciones, FechaPrescripcion, FechaExpiracion, Estado } = newPrescription;
            const formattedPrescription = {
                Medicamento,
                Dosis,
                Instrucciones,
                FechaPrescripcion: FechaPrescripcion ? new Date(FechaPrescripcion).toISOString().split('T')[0] : '',
                FechaExpiracion: FechaExpiracion ? new Date(FechaExpiracion).toISOString().split('T')[0] : '',
                Estado,
                VisitaID: medicalVisit.VisitaID,
            };
            const response = await api.post('/prescriptions', formattedPrescription);
            setPrescriptions([...prescriptions, response.data]);
            setNewPrescription({ Medicamento: '', Dosis: '', Instrucciones: '', FechaPrescripcion: '', FechaExpiracion: '', Estado: '' });
            setSnackbarMessage('Prescripción creada exitosamente');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            fetchPrescriptions(medicalVisit.VisitaID);
            handleClosePrescriptionDialog(); 
        } catch (error) {
            console.error('There was an error creating the prescription:', error);
            setSnackbarMessage('Error al crear la prescripción');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleUpdatePrescription = async (prescription) => {
        try {
            const { Medicamento, Dosis, Instrucciones, FechaPrescripcion, FechaExpiracion, Estado, PrescripcionID } = prescription;
            const formattedPrescription = {
                Medicamento,
                Dosis,
                Instrucciones,
                FechaPrescripcion: FechaPrescripcion ? new Date(FechaPrescripcion).toISOString().split('T')[0] : '',
                FechaExpiracion: FechaExpiracion ? new Date(FechaExpiracion).toISOString().split('T')[0] : '',
                Estado,
            };
            await api.put(`/prescriptions/${PrescripcionID}`, formattedPrescription);
            setPrescriptions(prescriptions.map(p => p.PrescripcionID === PrescripcionID ? { ...formattedPrescription, PrescripcionID } : p));
            setSnackbarMessage('Prescripción actualizada exitosamente');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            fetchPrescriptions(medicalVisit.VisitaID);
            handleClosePrescriptionDialog(); 
        } catch (error) {
            console.error('There was an error updating the prescription:', error);
            setSnackbarMessage('Error al actualizar la prescripción');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleDeletePrescription = async (prescriptionId) => {
        try {
            await api.delete(`/prescriptions/${prescriptionId}`);
            setPrescriptions(prescriptions.filter(p => p.PrescripcionID !== prescriptionId));
            setSnackbarMessage('Prescripción eliminada exitosamente');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            fetchPrescriptions(medicalVisit.VisitaID);
        } catch (error) {
            console.error('There was an error deleting the prescription:', error);
            setSnackbarMessage('Error al eliminar la prescripción');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleOpenVisitDialog = (appointment) => {
        setSelectedAppointment(appointment);
        fetchMedicalVisit(appointment.CitaID);
        setVisitDialogOpen(true);
    };

    const handleCloseVisitDialog = () => {
        setVisitDialogOpen(false);
        setMedicalVisit({ CitaID: '', FechaHora: '', MotivoConsulta: '', Diagnostico: '', Notas: '', Duracion: '' });
        setPrescriptions([]);
    };

    const handleOpenPrescriptionDialog = (prescription) => {
        if (prescription) {
            setNewPrescription({
                ...prescription,
                FechaPrescripcion: prescription.FechaPrescripcion ? prescription.FechaPrescripcion.split('T')[0] : '',
                FechaExpiracion: prescription.FechaExpiracion ? prescription.FechaExpiracion.split('T')[0] : '',
            });
        } else {
            setNewPrescription({ Medicamento: '', Dosis: '', Instrucciones: '', FechaPrescripcion: '', FechaExpiracion: '', Estado: '' });
        }
        setPrescriptionDialogOpen(true);
    };

    const handleClosePrescriptionDialog = () => {
        setPrescriptionDialogOpen(false);
        setNewPrescription({ Medicamento: '', Dosis: '', Instrucciones: '', FechaPrescripcion: '', FechaExpiracion: '', Estado: '' });
    };

    const handlePrescriptionInputChange = (event) => {
        const { name, value } = event.target;
        setNewPrescription({ ...newPrescription, [name]: value });
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h2" gutterBottom>
                Lista de Citas
            </Typography>
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
                                <Button variant="contained" color="primary" onClick={() => handleOpenVisitDialog(appointment)}>
                                    Gestionar Visita Médica
                                </Button>
                                {selectedAppointment && selectedAppointment.CitaID === appointment.CitaID && (
                                    <div>
                                        <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                                            Visita Médica
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label="Motivo de Consulta"
                                            value={medicalVisit.MotivoConsulta || ''}
                                            onChange={(e) => setMedicalVisit({ ...medicalVisit, MotivoConsulta: e.target.value })}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label="Diagnóstico"
                                            value={medicalVisit.Diagnostico || ''}
                                            onChange={(e) => setMedicalVisit({ ...medicalVisit, Diagnostico: e.target.value })}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label="Notas"
                                            value={medicalVisit.Notas || ''}
                                            onChange={(e) => setMedicalVisit({ ...medicalVisit, Notas: e.target.value })}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label="Duración"
                                            value={medicalVisit.Duracion || ''}
                                            onChange={(e) => setMedicalVisit({ ...medicalVisit, Duracion: e.target.value })}
                                        />
                                        {medicalVisit.VisitaID ? (
                                            <div>
                                                <Button variant="contained" color="primary" onClick={handleUpdateMedicalVisit}>
                                                    Actualizar Visita Médica
                                                </Button>
                                                <Button variant="contained" color="secondary" onClick={handleDeleteMedicalVisit}>
                                                    Eliminar Visita Médica
                                                </Button>
                                                <div>
                                                    <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                                                        Prescripciones
                                                    </Typography>
                                                    <List>
                                                        {prescriptions.map((prescription) => (
                                                            <ListItem key={prescription.PrescripcionID} alignItems="flex-start">
                                                                <Card variant="outlined" style={{ width: '100%' }}>
                                                                    <CardContent>
                                                                        <Typography variant="body2">Medicamento: {prescription.Medicamento}</Typography>
                                                                        <Typography variant="body2">Dosis: {prescription.Dosis}</Typography>
                                                                        <Typography variant="body2">Instrucciones: {prescription.Instrucciones}</Typography>
                                                                        <Typography variant="body2">Fecha de Prescripción: {prescription.FechaPrescripcion}</Typography>
                                                                        <Typography variant="body2">Fecha de Expiración: {prescription.FechaExpiracion}</Typography>
                                                                        <Typography variant="body2">Estado: {prescription.Estado}</Typography>
                                                                        <Button variant="contained" color="primary" onClick={() => handleOpenPrescriptionDialog(prescription)}>
                                                                            Editar
                                                                        </Button>
                                                                        <Button variant="contained" color="secondary" onClick={() => handleDeletePrescription(prescription.PrescripcionID)}>
                                                                            Eliminar
                                                                        </Button>
                                                                    </CardContent>
                                                                </Card>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                    <Button variant="contained" color="primary" onClick={() => handleOpenPrescriptionDialog(null)}>
                                                        Añadir Prescripción
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button variant="contained" color="primary" onClick={handleCreateMedicalVisit}>
                                                Crear Visita Médica
                                            </Button>
                                        )}
                                    </div>
                                )}
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
            <Dialog open={prescriptionDialogOpen} onClose={handleClosePrescriptionDialog}>
                <DialogTitle>{newPrescription.PrescripcionID ? 'Editar Prescripción' : 'Añadir Prescripción'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Medicamento"
                        value={newPrescription.Medicamento || ''}
                        onChange={handlePrescriptionInputChange}
                        name="Medicamento"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Dosis"
                        value={newPrescription.Dosis || ''}
                        onChange={handlePrescriptionInputChange}
                        name="Dosis"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Instrucciones"
                        value={newPrescription.Instrucciones || ''}
                        onChange={handlePrescriptionInputChange}
                        name="Instrucciones"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Fecha de Prescripción"
                        type="date"
                        value={newPrescription.FechaPrescripcion || ''}
                        onChange={handlePrescriptionInputChange}
                        name="FechaPrescripcion"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Fecha de Expiración"
                        type="date"
                        value={newPrescription.FechaExpiracion || ''}
                        onChange={handlePrescriptionInputChange}
                        name="FechaExpiracion"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={newPrescription.Estado || ''}
                            onChange={handlePrescriptionInputChange}
                            name="Estado"
                        >
                            <MenuItem value="Activa">Activa</MenuItem>
                            <MenuItem value="Expirada">Expirada</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePrescriptionDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={newPrescription.PrescripcionID ? () => handleUpdatePrescription(newPrescription) : handleCreatePrescription} color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AppointmentsList;
