import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../axiosConfig'; 
import { Card, CardContent, Typography, CircularProgress, Container, TextField, Button, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

function UserProfile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        api.get(`/users/${id}`)
            .then(response => {
                console.log(response.data);
                setUser(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching user details:', err);
                setError('Error fetching user details');
                setLoading(false);
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSave = () => {
        setLoading(true);
        api.put(`/users/${id}`, user)
            .then(response => {
                setIsEditing(false);
                setLoading(false);
                setSnackbarMessage('Usuario actualizado con éxito');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            })
            .catch(err => {
                console.error('Error updating user details:', err);
                setError('Error updating user details');
                setLoading(false);
                setSnackbarMessage('Error actualizando el usuario');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
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
                    <Typography variant="h4" gutterBottom>Perfil del Usuario</Typography>
                    {user ? (
                        <>
                            {isEditing ? (
                                <>
                                    <TextField
                                        label="Nombre"
                                        name="Nombre"
                                        value={user.Nombre}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Email"
                                        name="Email"
                                        value={user.Email}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Teléfono"
                                        name="Teléfono"
                                        value={user.Teléfono}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Dirección"
                                        name="Dirección"
                                        value={user.Dirección}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Rol"
                                        name="Rol"
                                        value={user.Rol}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Fecha de Registro"
                                        name="FechaRegistro"
                                        value={user.FechaRegistro}
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
                                    <Typography variant="h6">Nombre: {user.Nombre}</Typography>
                                    <Typography color="textSecondary">Email: {user.Email}</Typography>
                                    <Typography color="textSecondary">Teléfono: {user.Teléfono}</Typography>
                                    <Typography color="textSecondary">Dirección: {user.Dirección}</Typography>
                                    <Typography color="textSecondary">Rol: {user.Rol}</Typography>
                                    <Typography color="textSecondary">Fecha de Registro: {user.FechaRegistro}</Typography>
                                    <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} style={{ marginTop: '10px' }}>
                                        Editar
                                    </Button>
                                </>
                            )}
                        </>
                    ) : (
                        <Typography color="textSecondary">No se encontraron detalles para el usuario con ID {id}.</Typography>
                    )}
                </CardContent>
            </Card>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
}

export default UserProfile;
