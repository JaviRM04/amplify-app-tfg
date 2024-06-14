import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8', // Azul vibrante
      contrastText: '#ffffff', // Contraste de texto en botones primarios
    },
    secondary: {
      main: '#34a853', // Verde vibrante
      contrastText: '#ffffff', // Contraste de texto en botones secundarios
    },
    background: {
      default: '#f0f2f5', // Fondo claro y limpio
      paper: '#ffffff', // Fondo de los componentes
    },
    text: {
      primary: '#333333', // Texto principal oscuro
      secondary: '#555555', // Texto secundario
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '0.5px',
      lineHeight: 1.2,
      color: '#333333',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      lineHeight: 1.3,
      color: '#333333',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      letterSpacing: '0.5px',
      lineHeight: 1.4,
      color: '#333333',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      letterSpacing: '0.5px',
      lineHeight: 1.4,
      color: '#333333',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#555555',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#555555',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '12px 24px',
          boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 10px 24px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #1a73e8 30%, #4285f4 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1a73e8 30%, #4285f4 90%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #34a853 30%, #66bb6a 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #34a853 30%, #66bb6a 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0px 12px 28px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '24px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '& fieldset': {
              borderColor: '#cccccc',
            },
            '&:hover fieldset': {
              borderColor: '#1a73e8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1a73e8',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          borderRadius: '12px',
          padding: '20px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #1a73e8 30%, #4285f4 90%)',
          boxShadow: 'none',
          color: '#ffffff',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '24px',
          paddingBottom: '24px',
        },
      },
    },
  },
});

export default theme;
