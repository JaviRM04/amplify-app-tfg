import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, CircularProgress, Container, TextField, Button, List, ListItem, Divider, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import api from '../../../axiosConfig'; 
import moment from 'moment';
function PatientProfile() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [bloodTests, setBloodTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [currentBloodTest, setCurrentBloodTest] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const healthyRanges = {
        hemoglobina: { min: 13.5, max: 17.5 },
        leucocitos: { min: 4000, max: 11000 },
        plaquetas: { min: 150000, max: 450000 },
        glucosa: { min: 70, max: 100 },
        colesterol: { min: 125, max: 200 },
        trigliceridos: { min: 0, max: 150 },
        hematocrito: { min: 38.8, max: 50 },
        eritrocitos: { min: 4.7, max: 6.1 },
        urea: { min: 7, max: 20 },
        creatina: { min: 0.6, max: 1.3 },
        hdl: { min: 40, max: 60 },
        ldl: { min: 0, max: 100 },
        bilirrubina: { min: 0.1, max: 1.2 },
        transaminasas: { min: 10, max: 40 },
        proteina_c_reactiva: { min: 0, max: 0.3 },
    };

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const patientResponse = await api.get(`/patients/${id}`);
                const appointmentsResponse = await api.get('/appointments');
                const bloodTestsResponse = await api.get('/blood-tests');
                setPatient(patientResponse.data);
                setAppointments(appointmentsResponse.data.filter(appointment => appointment.PacienteID === parseInt(id)));
                setBloodTests(bloodTestsResponse.data.filter(test => test.PacienteID === parseInt(id)));
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

    const handleBloodTestChange = (e) => {
        const { name, value } = e.target;
        setCurrentBloodTest({
            ...currentBloodTest,
            [name]: value
        });
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setIsCreating(false);
        setCurrentBloodTest(null);
    };

    const handleCreateBloodTest = () => {
        setCurrentBloodTest({
            PacienteID: parseInt(id),
            FechaRealizacion: '',
            Resultados: '',
            Observaciones: '',
            hemoglobina: '',
            leucocitos: '',
            plaquetas: '',
            glucosa: '',
            colesterol: '',
            trigliceridos: '',
            hematocrito: '',
            eritrocitos: '',
            urea: '',
            creatina: '',
            hdl: '',
            ldl: '',
            bilirrubina: '',
            transaminasas: '',
            proteina_c_reactiva: '',
        });
        setIsCreating(true);
        setDialogOpen(true);
    };

    const handleEditBloodTest = (bloodTest) => {
        setCurrentBloodTest(bloodTest);
        setDialogOpen(true);
    };

    const handleDeleteBloodTest = async (bloodTestId) => {
        try {
            await api.delete(`/blood-tests/${bloodTestId}`);
            setBloodTests(bloodTests.filter(test => test.AnalisisID !== bloodTestId));
            setSnackbarMessage('Análisis de sangre eliminado con éxito');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (err) {
            console.error('Error deleting blood test:', err);
            setSnackbarMessage('Error eliminando el análisis de sangre');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleDialogSave = async () => {
        try {
            if (isCreating) {
                const response = await api.post('/blood-tests', currentBloodTest);
                setBloodTests([...bloodTests, response.data]);
                setSnackbarMessage('Análisis de sangre creado con éxito');
            } else {
                await api.put(`/blood-tests/${currentBloodTest.AnalisisID}`, currentBloodTest);
                setBloodTests(bloodTests.map(test => test.AnalisisID === currentBloodTest.AnalisisID ? currentBloodTest : test));
                setSnackbarMessage('Análisis de sangre actualizado con éxito');
            }
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleDialogClose();
        } catch (err) {
            console.error('Error saving blood test:', err);
            setSnackbarMessage('Error guardando el análisis de sangre');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
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

    const getBloodTestData = (bloodTest) => [
        { name: 'hemoglobina', value: bloodTest.hemoglobina },
        { name: 'leucocitos', value: bloodTest.leucocitos },
        { name: 'plaquetas', value: bloodTest.plaquetas },
        { name: 'glucosa', value: bloodTest.glucosa },
        { name: 'colesterol', value: bloodTest.colesterol },
        { name: 'trigliceridos', value: bloodTest.trigliceridos },
        { name: 'hematocrito', value: bloodTest.hematocrito },
        { name: 'eritrocitos', value: bloodTest.eritrocitos },
        { name: 'urea', value: bloodTest.urea },
        { name: 'creatina', value: bloodTest.creatina },
        { name: 'hdl', value: bloodTest.hdl },
        { name: 'ldl', value: bloodTest.ldl },
        { name: 'bilirrubina', value: bloodTest.bilirrubina },
        { name: 'transaminasas', value: bloodTest.transaminasas },
        { name: 'proteina_c_reactiva', value: bloodTest.proteina_c_reactiva },
    ];

    const formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY HH:mm');
    };
    return (
        <Container>
            <Card raised>
                <CardContent>
                    <Typography variant="h4" gutterBottom>Perfil del Paciente</Typography>
                    
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
                                </>
                    
                </CardContent>
            </Card>

            <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
                Citas Asociadas
            </Typography>
            <List>
                {appointments.map((appointment) => (
                    <ListItem key={appointment.CitaID} alignItems="flex-start">
                        <Card variant="outlined" style={{ width: '100%' }}>
                            <CardContent>
                                <Typography variant="h6">Cita : {formatDate(appointment.FechaHora)}</Typography>
                                <Divider style={{ margin: '10px 0' }} />
                                <Typography variant="body2">Fecha y Hora: {appointment.FechaHora}</Typography>
                                <Typography variant="body2">Estado: {appointment.Estado}</Typography>
                                <Typography variant="body2">Notas: {appointment.Notas}</Typography>
                            </CardContent>
                        </Card>
                    </ListItem>
                ))}
            </List>

            <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
                Resultados de Análisis de Sangre
            </Typography>
            <Button variant="contained" color="primary" onClick={handleCreateBloodTest} style={{ marginTop: '20px' }}>
                Añadir Análisis de Sangre
            </Button>

            <List>
                {bloodTests.map((test) => (
                    <ListItem key={test.AnalisisID} alignItems="flex-start">
                        <Card variant="outlined" style={{ width: '100%', marginBottom: '20px' }}>
                            <CardContent>
                                <Typography variant="h6">Análisis de Sangre : {test.FechaRealizacion}</Typography>
                                <Typography variant="body2">Fecha de Realización: {test.FechaRealizacion}</Typography>
                                <Typography variant="body2">Resultados: {test.Resultados}</Typography>
                                <Typography variant="body2">Observaciones: {test.Observaciones}</Typography>
                                <Button variant="contained" color="secondary" onClick={() => handleEditBloodTest(test)} style={{ marginRight: '10px', marginTop: '10px' }}>
                                    Editar
                                </Button>
                                <Button variant="contained" color="error" onClick={() => handleDeleteBloodTest(test.AnalisisID)} style={{ marginTop: '10px' }}>
                                    Eliminar
                                </Button>
                                <BarChart width={800} height={400} data={getBloodTestData(test)} style={{ marginTop: '20px' }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value">
                                        {getBloodTestData(test).map((entry, index) => {
                                            const isHealthy = entry.value >= healthyRanges[entry.name]?.min && entry.value <= healthyRanges[entry.name]?.max;
                                            return <Cell key={`cell-${index}`} fill={isHealthy ? '#8884d8' : '#FF0000'} />;
                                        })}
                                    </Bar>
                                </BarChart>
                            </CardContent>
                        </Card>
                    </ListItem>
                ))}
            </List>

            <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>{isCreating ? 'Crear Análisis de Sangre' : 'Editar Análisis de Sangre'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Fecha de Realización"
                        name="FechaRealizacion"
                        type="date"
                        value={currentBloodTest?.FechaRealizacion || ''}
                        onChange={handleBloodTestChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Resultados"
                        name="Resultados"
                        value={currentBloodTest?.Resultados || ''}
                        onChange={handleBloodTestChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Observaciones"
                        name="Observaciones"
                        value={currentBloodTest?.Observaciones || ''}
                        onChange={handleBloodTestChange}
                        fullWidth
                        margin="normal"
                    />
                    {Object.keys(healthyRanges).map((key) => (
                        <TextField
                            key={key}
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            name={key}
                            type="number"
                            value={currentBloodTest?.[key] || ''}
                            onChange={handleBloodTestChange}
                            fullWidth
                            margin="normal"
                        />
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDialogSave} color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
}

export default PatientProfile;
