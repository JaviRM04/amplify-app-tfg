import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../Medico/theme/theme';
import Navbar from '../Medico/components/Navbar';
import Footer from '../Medico/components/Footer';
import Dashboard from '../Medico/pages/Dashboard';
import PatientList from '../Medico/pages/patients/PatientList';
import PatientProfile from '../Medico/pages/patients/PatientProfile';
import AppointmentsList from '../Medico/pages/appointments/AppointmentsList';



const HealthProfessionalPortal = () => {


  return (
        <ThemeProvider theme={theme}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/patient/:id" element={<PatientProfile />} />
              <Route path="/appointments" element={<AppointmentsList />} />
            </Routes>
            <Footer />
        </ThemeProvider>
  );
};

export default HealthProfessionalPortal;