import React from 'react';
import {  Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../Recepcionista/theme/theme';
import Navbar from '../Recepcionista/components/Navbar';
import Footer from '../Recepcionista/components/Footer';
import Dashboard from '../Recepcionista/pages/Dashboard';
import PatientList from '../Recepcionista/pages/patients/PatientList';
import PatientProfile from '../Recepcionista/pages/patients/PatientProfile';
import UserProfile from '../Recepcionista/pages/users/UserProfile';
import UsersList from '../Recepcionista/pages/users/UserList';
import AppointmentsList from '../Recepcionista/pages/appointments/AppointmentsList';
import AppointmentForm from '../Recepcionista/pages/appointments/AppointmentForm';
import EditAppointmentForm from '../Recepcionista/pages/appointments/EditAppointmentForm';
import NewUserForm from '../Recepcionista/pages/users/NewUserForm';
import NewPatientForm from '../Recepcionista/pages/patients/NewPatientForm';


const ReceptionistPortal = () => {
  

  return (
        <ThemeProvider theme={theme}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/patient/:id" element={<PatientProfile />} />
              <Route path="/patients/new" element={<NewPatientForm />} />
              <Route path="/users" element={<UsersList />} />
              <Route path="/user/:id" element={<UserProfile />} />
              <Route path="/users/new" element={<NewUserForm />} /> 
              <Route path="/appointments" element={<AppointmentsList />} />
              <Route path="/appointments/new" element={<AppointmentForm />} />
              <Route path="/appointments/edit/:id" element={<EditAppointmentForm />} />
            </Routes>
            <Footer />
        </ThemeProvider>
  );
};

export default ReceptionistPortal;