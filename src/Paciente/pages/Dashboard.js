import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';

const DashboardPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    backgroundColor: '#f5f5f5',
    boxShadow: theme.shadows[3],
    borderRadius: '8px',
}));    

const DashboardContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const WelcomeTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
}));

const SubheadingTypography = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
}));

const BodyTypography = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

const PatientDashboard = () => {

    return (
        <DashboardContainer>
            <DashboardPaper>
                <WelcomeTypography variant="h2" gutterBottom>
                    Bienvenido
                </WelcomeTypography>
                <SubheadingTypography variant="h5" gutterBottom>
                    Nos alegra verte de nuevo. Aquí puedes gestionar tu información personal, 
                    ver tus próximas citas, revisar tus análisis de sangre y tus visitas médicas.
                </SubheadingTypography>
                <BodyTypography variant="body1" gutterBottom>
                    Recuerda que cuidar de tu salud es lo más importante. 
                    Revisa regularmente tus análisis de sangre, mantén tus datos actualizados
                    y no dudes en contactar a tu médico si tienes alguna duda o preocupación. 
                            Estamos aquí para ayudarte en cada paso del camino hacia una vida más saludable.
                </BodyTypography>
            </DashboardPaper>
        </DashboardContainer>
    );
};

export default PatientDashboard;
