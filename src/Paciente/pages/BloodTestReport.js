import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import api from '../../axiosConfig'; 

const BloodTestReport = () => {
    const { id } = useParams();
    const [bloodTest, setBloodTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        const fetchBloodTest = async () => {
            try {
                const response = await api.get(`/blood-tests/${id}`);
                setBloodTest(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching blood test details:', err);
                setError('Error fetching blood test details');
                setLoading(false);
            }
        };

        fetchBloodTest();
    }, [id]);

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

    if (!bloodTest) {
        return <Typography variant="h6" color="error">No se encontraron detalles para el análisis de sangre con ID {id}.</Typography>;
    }

    const data = [
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

    const anomalies = data.filter(item => item.value < healthyRanges[item.name]?.min || item.value > healthyRanges[item.name]?.max);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Informe del Análisis de Sangre  {bloodTest.FechaRealizacion}
            </Typography>
            <Paper style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h6" gutterBottom>
                    Fecha de Realización: {bloodTest.FechaRealizacion}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Resultados: {bloodTest.Resultados}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Observaciones: {bloodTest.Observaciones}
                </Typography>
                {anomalies.length > 0 && (
                    <Typography variant="body1" color="error" gutterBottom>
                        ¡Advertencia! Se han detectado valores fuera del rango saludable:
                        <ul>
                            {anomalies.map((anomaly, index) => (
                                <li key={index}>
                                    {anomaly.name.charAt(0).toUpperCase() + anomaly.name.slice(1)}: {anomaly.value} (rango saludable: {healthyRanges[anomaly.name].min} - {healthyRanges[anomaly.name].max})
                                </li>
                            ))}
                        </ul>
                    </Typography>
                )}
                <BarChart width={800} height={400} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value">
                        {data.map((entry, index) => {
                            const isHealthy = entry.value >= healthyRanges[entry.name]?.min && entry.value <= healthyRanges[entry.name]?.max;
                            return <Cell key={`cell-${index}`} fill={isHealthy ? '#8884d8' : '#FF0000'} />;
                        })}
                    </Bar>
                </BarChart>
            </Paper>
        </Container>
    );
};

export default BloodTestReport;
