import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../Paciente/theme/theme';
import Navbar from '../Paciente/components/Navbar';
import Footer from '../Paciente/components/Footer';
import Dashboard from '../Paciente/pages/Dashboard';
import AppointmentsList from '../Paciente/pages/AppointmentsList';
import Profile from '../Paciente/pages/Profile';
import BloodTestList from '../Paciente/pages/BloodTestList';
import BloodTestReport from '../Paciente/pages/BloodTestReport';
import MedicalVisitsList from '../Paciente/pages/MedicalVisitsList';
import { Route, Routes } from 'react-router-dom';
const PatientPortal = ({ onSubmit, userId }) => {
    return (
        <ThemeProvider theme={theme}>
          
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/appointments" element={<AppointmentsList />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/blood-tests" element={<BloodTestList />} />
              <Route path="/blood-test-report/:id" element={<BloodTestReport />} />
              <Route path="/medical-visits" element={<MedicalVisitsList />} />
            </Routes>
            <Footer />
          
        </ThemeProvider>
      );
};

export default PatientPortal;
