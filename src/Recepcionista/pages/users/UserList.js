import React, { useEffect, useState } from 'react';
import api from '../../../axiosConfig'; // Importa la instancia de Axios configurada
import { useNavigate } from 'react-router-dom';
import { List, ListItem, Card, CardContent, Typography, Divider, Button, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

function UsersList() {
    const [users, setUsers] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();  // Hook para navegar

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('There was an error fetching the user data:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            setSnackbarMessage('Usuario eliminado con éxito');
            setSnackbarSeverity('success');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            setSnackbarMessage('Error eliminando el usuario');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h2" gutterBottom>
                Lista de Usuarios
            </Typography>
            <Button
                variant="contained"
                color="primary"
                style={{ marginBottom: '20px' }}
                onClick={() => navigate('/users/new')}
            >
                Crear Nuevo Usuario
            </Button>
            <List>
                {users.map((user) => (
                    <ListItem key={user.UserID} alignItems="flex-start">
                        <Card variant="outlined" style={{ width: '100%' }}>
                            <CardContent>
                                <Typography variant="h6">{user.Nombre}</Typography>
                                <Divider style={{ margin: '10px 0' }} />
                                <Typography variant="body2">Email: {user.Email}</Typography>
                                <Typography variant="body2">Teléfono: {user.Teléfono}</Typography>
                                <Typography variant="body2">Dirección: {user.Dirección}</Typography>
                                <Typography variant="body2">Rol: {user.Rol}</Typography>
                                <Typography variant="body2">Fecha de Registro: {user.FechaRegistro}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: '10px', marginRight: '10px' }}
                                    onClick={() => navigate(`/user/${user.UserID}`)}
                                >
                                    Ver Perfil
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    style={{ marginTop: '10px' }}
                                    onClick={() => handleDelete(user.UserID)}
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
        </div>
    );
}

export default UsersList;
