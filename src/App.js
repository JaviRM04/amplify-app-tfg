import React, { useState, useEffect, useContext } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from '@aws-amplify/auth';
import awsExports from './aws-exports';
import { withAuthenticator, ThemeProvider } from '@aws-amplify/ui-react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline, Container, Typography, Button, Box } from '@mui/material';
import api from './axiosConfig';  // Cambiado aquí
import UserProfileForm from './utils/UserProfileForm';
import PatientForm from './utils/PatientForm';
import ReceptionistForm from './utils/ReceptionistForm';
import HealthProfessionalPortal from './utils/HealthProfessionalPortal';
import HealthMedicalForm from './utils/HealthProfessionalForm';
import PatientPortal from './utils/PatientPortal';
import ReceptionistPortal from './utils/ReceptionistPortal';
import { UserContext } from './utils/UserContext';

Amplify.configure(awsExports);
const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App({ signOut, user }) {
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const [portal, setPortal] = useState(null);
  const [entityExist, setEntityExist] = useState(false);
  const [refreshNeeded, setRefreshNeeded] = useState(false);
  const { userId, setUserId, userRole, setUserRole, roleId, setRoleId } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      console.log('User object:', user);
      const checkUserExists = async () => {
        try {
          const response = await api.get('/users');
          console.log('API GET USERS Response:', response);
          const existingUser = response.data.find(u => u.amplifyId === user.userId);
          if (existingUser) {
            setUserExists(true);
            setUserRole(existingUser.Rol); 
            setUserId(existingUser.UserID); 
            console.log('User role set to:', existingUser.Rol);
            console.log('UserID set to:', existingUser.UserID);
            checkEntityExists(existingUser.Rol, existingUser.UserID);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false);
        }
      };
      checkUserExists();

      const fetchToken = async () => {
        try {
          const session = await fetchAuthSession();
          console.log('Session object:', session); 
          if (session && session.tokens && session.tokens.idToken) {
            const token = session.tokens.idToken;
            const jwtToken = token.jwtToken;
            console.log('Token JWT:', jwtToken);
          } else {
            console.error('Token JWT no encontrado en el objeto de sesión');
          }
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      };

      fetchToken();
    } else {
      setLoading(false); 
    }
  }, [user]);

  useEffect(() => {
    if (userId && userRole) {
      checkEntityExists(userRole, userId);
    }
  }, [userId, userRole]);

  useEffect(() => {
      if (refreshNeeded) {
        window.location.reload();
      }
  }, [refreshNeeded]);

  const checkEntityExists = async (role, userId) => {
    try {
      let endpoint = ''; 
      if (role === 'Paciente') {
        endpoint = 'patients';
      } else if (role === 'Médico') {
        endpoint = 'health-professionals';
      } else {
        endpoint = 'receptionists';
      }
      const response = await api.get(`/${endpoint}`);
      console.log("Endpoint: ", endpoint);
      console.log("response: ", response);
      const entityExists = response.data.some(entity => entity.UserID === userId);
      if (endpoint === 'patients') {
        let patient = response.data.find(entity => entity.UserID === userId);
        setRoleId(patient.PacienteID);
      } else if (endpoint === 'receptionists') {
        let receptionist = response.data.find(entity => entity.UserID === userId);
        setRoleId(receptionist.RecepcionistaID);
      } else if (endpoint === 'health-professionals') {
        let healthProfessional = response.data.find(entity => entity.UserID === userId);
        setRoleId(healthProfessional.ProfesionalID);
      }
      setEntityExist(entityExists);
      console.log(`Entity exist for role ${role}:`, entityExists);
    } catch (error) {
      console.error('Error fetching entities:', error);
    }
  };

  const handleUserProfileSubmit = async (profileData) => {
    console.log('Submitting profile data:', profileData);
    try {
      const response = await api.post('/users', profileData);
      setUserExists(true);
      setUserRole(profileData.Rol); 
      setUserId(response.data.UserID); 
      console.log('User role set to:', profileData.Rol);
      console.log('UserID set to:', response.data.UserID);
      setRefreshNeeded(true); 
    } catch (error) {
      console.error('Error creando el perfil del usuario:', error);
    }
  };

  const handleEntityCreation = async (entityData) => {
    console.log('Entity Data:', entityData);
    try {
      let endpoint = ''; 
      if (userRole === 'Paciente') {
        endpoint = '/patients';
      } else if (userRole === 'Médico') {
        endpoint = '/health-professionals';
      } else {
        endpoint = '/receptionists';
      }
      console.log('Sending POST request to:', endpoint);
      await api.post(endpoint, entityData);
      await checkEntityExists(userRole, userId);
      if (userRole === 'Paciente') {
        setPortal(<PatientPortal />);
      } else if (userRole === 'Médico') {
        setPortal(<HealthProfessionalPortal />);
      } else {
        setPortal(<ReceptionistPortal />);
      }
    } catch (error) {
      console.error('Error creando la entidad:', error);
    }
  };

  const handleAccessPortal = () => {
    if (userRole === 'Paciente') {
      setPortal(<PatientPortal />);
    } else if (userRole === 'Recepcionista') {
      setPortal(<ReceptionistPortal />);
    } else if (userRole === 'Médico') {
      setPortal(<HealthProfessionalPortal />);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    console.log('No user object available.');
    return <div>No se ha autenticado el usuario.</div>;
  }

  if (!userExists) {
    console.log('User does not exist. Displaying UserProfileForm.');
    return <UserProfileForm onSubmit={handleUserProfileSubmit} user={user} />;
  }

  if (userExists && userRole && !entityExist && userId) {
    if (userRole === 'Paciente') {
      return <PatientForm onSubmit={handleEntityCreation} userId={userId} />;
    } else if (userRole === 'Recepcionista') {
      return <ReceptionistForm onSubmit={handleEntityCreation} userId={userId} />;
    } else if (userRole === 'Médico') {
      return <HealthMedicalForm onSubmit={handleEntityCreation} userId={userId} />;
    }
  }

  if (portal) {
    return portal;
  }

  console.log('Entity Exist:', entityExist);
  console.log('Rendering form based on user role:', userRole);
  console.log('UserID:', userId);
  console.log('portal', portal);
  console.log('roleId', roleId);
  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Bienvenido, {user.username}
            </Typography>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={signOut}
            >
              Cerrar Sesión
            </Button>
            {userRole && (
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="secondary"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleAccessPortal}
              >
                Acceder al Portal
              </Button>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default withAuthenticator(App);
