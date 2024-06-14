import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../utils/UserContext';
import { Card, CardContent, Typography, CircularProgress, Container, Snackbar, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import api from '../../axiosConfig'; // Importa la instancia de Axios configurada

const Profile = () => {
    const { userId, roleId } = useContext(UserContext);
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await api.get(`/patients/${roleId}`);
                setPatient(response.data);
                setEditData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching patient details:', err);
                setError('Error fetching patient details');
                setLoading(false);
                setSnackbarMessage('Error fetching patient details');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };

        fetchPatientData();
    }, [roleId]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleEditOpen = () => {
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value,
        });
    };

    const handleSaveChanges = async () => {
        try {
            await api.put(`/patients/${roleId}`, editData);
            setPatient(editData);
            setSnackbarMessage('Datos actualizados correctamente');
            setSnackbarSeverity('success');
            setEditOpen(false);
        } catch (err) {
            console.error('Error updating patient details:', err);
            setSnackbarMessage('Error actualizando los datos del paciente');
            setSnackbarSeverity('error');
        } finally {
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

    return (
        <Container>
            <Card raised>
                <CardContent>
                    <Typography variant="h4" gutterBottom>Perfil del Paciente</Typography>
                    {patient ? (
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
                            <Button variant="contained" color="primary" onClick={handleEditOpen}>Editar Perfil</Button>
                        </>
                    ) : (
                        <Typography color="textSecondary">No se encontraron detalles para el paciente con ID {userId}.</Typography>
                    )}
                </CardContent>
            </Card>

            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Editar Perfil</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" name="DNI" label="DNI" type="text" fullWidth value={editData.DNI || ''} onChange={handleInputChange} />
                    <TextField margin="dense" name="FechaNacimiento" label="Fecha de Nacimiento" type="date" fullWidth value={editData.FechaNacimiento || ''} onChange={handleInputChange} />
                    <TextField margin="dense" name="Genero" label="Género" type="text" fullWidth value={editData.Genero || ''} onChange={handleInputChange} />
                    <TextField margin="dense" name="Direccion" label="Dirección" type="text" fullWidth value={editData.Direccion || ''} onChange={handleInputChange} />
                    <TextField margin="dense" name="NumeroSeguridadSocial" label="Número de Seguridad Social" type="text" fullWidth value={editData.NumeroSeguridadSocial || ''} onChange={handleInputChange} />
                    <TextField margin="dense" name="GrupoSanguineo" label="Grupo Sanguíneo" type="text" fullWidth value={editData.GrupoSanguineo || ''} onChange={handleInputChange} />
                    <TextField margin="dense" name="Alergias" label="Alergias" type="text" fullWidth value={editData.Alergias || ''} onChange={handleInputChange} />
                    <TextField margin="dense" name="AntecedentesPersonales" label="Antecedentes Personales" type="text" fullWidth value={editData.AntecedentesPersonales || ''} onChange={handleInputChange} />
                    <TextField margin="dense" name="AntecedentesFamiliares" label="Antecedentes Familiares" type="text" fullWidth value={editData.AntecedentesFamiliares || ''} onChange={handleInputChange} />
                    <TextField margin="dense" name="NotasMedicas" label="Notas Médicas" type="text" fullWidth value={editData.NotasMedicas || ''} onChange={handleInputChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="primary">Cancelar</Button>
                    <Button onClick={handleSaveChanges} color="primary">Guardar Cambios</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
};

export default Profile;
