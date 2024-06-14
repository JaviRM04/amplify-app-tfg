import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../utils/UserContext';
import { List, ListItem, Card, CardContent, Typography, Divider, Container, CircularProgress, Snackbar, Button } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import api from '../../axiosConfig'; // Importa la instancia de Axios configurada

const BloodTestList = () => {
    const { roleId } = useContext(UserContext);
    const [bloodTests, setBloodTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBloodTests = async () => {
            try {
                const response = await api.get('/blood-tests');
                const filteredTests = response.data.filter(test => test.PacienteID === parseInt(roleId));
                setBloodTests(filteredTests);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching blood tests:', err);
                setError('Error fetching blood tests');
                setLoading(false);
                setSnackbarMessage('Error fetching blood tests');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };

        fetchBloodTests();
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
                Lista de Análisis de Sangre
            </Typography>
            <List>
                {bloodTests.map((test) => (
                    <ListItem key={test.AnalisisID} alignItems="flex-start">
                        <Card variant="outlined" style={{ width: '100%' }}>
                            <CardContent>
                                <Typography variant="h6">Análisis ID: {test.AnalisisID}</Typography>
                                <Divider style={{ margin: '10px 0' }} />
                                <Typography variant="body2">Fecha de Realización: {test.FechaRealizacion}</Typography>
                                <Typography variant="body2">Resultados: {test.Resultados}</Typography>
                                <Typography variant="body2">Observaciones: {test.Observaciones}</Typography>
                                <Typography variant="body2">Hemoglobina: {test.hemoglobina}</Typography>
                                <Typography variant="body2">Leucocitos: {test.leucocitos}</Typography>
                                <Typography variant="body2">Plaquetas: {test.plaquetas}</Typography>
                                <Typography variant="body2">Glucosa: {test.glucosa}</Typography>
                                <Typography variant="body2">Colesterol: {test.colesterol}</Typography>
                                <Typography variant="body2">Triglicéridos: {test.trigliceridos}</Typography>
                                <Typography variant="body2">Hematocrito: {test.hematocrito}</Typography>
                                <Typography variant="body2">Eritrocitos: {test.eritrocitos}</Typography>
                                <Typography variant="body2">Urea: {test.urea}</Typography>
                                <Typography variant="body2">Creatina: {test.creatina}</Typography>
                                <Typography variant="body2">HDL: {test.hdl}</Typography>
                                <Typography variant="body2">LDL: {test.ldl}</Typography>
                                <Typography variant="body2">Bilirrubina: {test.bilirrubina}</Typography>
                                <Typography variant="body2">Transaminasas: {test.transaminasas}</Typography>
                                <Typography variant="body2">Proteína C Reactiva: {test.proteina_c_reactiva}</Typography>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    style={{ marginTop: '10px' }}
                                    onClick={() => navigate(`/blood-test-report/${test.AnalisisID}`)}
                                >
                                    Ver Informe
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
};

export default BloodTestList;
