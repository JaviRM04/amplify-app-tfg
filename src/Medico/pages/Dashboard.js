import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, CircularProgress, Paper, Box } from '@mui/material';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
            <Paper elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
                <Typography variant="h2" gutterBottom>
                    Bienvenido
                </Typography>
                <Box mt={4} mb={4}>
                    <Typography variant="h5" gutterBottom style={{ color: '#4caf50' }}>
                        Gestión Integral para Profesionales de Salud
                    </Typography>
                    <Typography variant="body1" gutterBottom style={{ marginBottom: '20px' }}>
                        Aquí puedes gestionar las visitas médicas, pacientes y su historial médico. Utiliza el menú de navegación para acceder a las diferentes secciones del portal.
                    </Typography>
                </Box>
                <Box mt={4} mb={4} style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px' }}>
                    <Typography variant="h6" gutterBottom>
                        Tu Rol es Crucial
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Como profesional de la salud, tu rol es fundamental para asegurar que todos los pacientes reciban el mejor cuidado posible. Gracias por tu dedicación y esfuerzo.
                    </Typography>
                </Box>
                <Box mt={4} mb={4} style={{ backgroundColor: '#fff3e0', padding: '20px', borderRadius: '8px' }}>
                    <Typography variant="h6" gutterBottom>
                        Recordatorio
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Recuerda revisar las visitas programadas y asegurarte de que la información de los pacientes esté actualizada. Si tienes alguna pregunta, no dudes en contactar con el administrador del sistema.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Dashboard;
