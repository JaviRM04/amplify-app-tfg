import React, { useState } from 'react';
import api from '../../../axiosConfig'; // Importa la instancia de Axios configurada
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const NewUserForm = () => {
    const [user, setUser] = useState({
        Nombre: '',
        Email: '',
        Teléfono: '',
        Dirección: '',
        Rol: '',
        FechaRegistro: new Date().toISOString().split('T')[0]
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSave = async () => {
        try {
            await api.post('/users', user, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setSnackbarMessage('Usuario creado con éxito');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate('/users');
            }, 2000);
        } catch (error) {
            console.error('Error creating user:', error);
            setSnackbarMessage('Error creando el usuario');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Crear Nuevo Usuario
            </Typography>
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
            <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '10px' }}>
                Guardar
            </Button>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
};

export default NewUserForm;
