import { createTheme } from '@mui/material/styles';

const colors = {
  primary: {
    main: '#ffff00',
    light: '#ffff00',
    dark: '#ffff00',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ffff00',
    light: '#ffff00',
    dark: '#ffff00',
    contrastText: '#ffffff',
  },
  background: {
    default: '#2D9DFF',
    paper: '#ffffff',
  },
  text: {
    primary: '#ffffff',
    secondary: '#ffff00',
  }
};

const typography = {
  fontFamily: '"Doto", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    color: colors.text.secondary,
    fontSize: '2.5rem',
    fontWeight: 800,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 800,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 800,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 800,
  },
  h5: {
    fontSize: '1rem',
    fontWeight: 800,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 800,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 800,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 800,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 800,
  }
};

const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 800,
        padding: '8px 16px',
        boxShadow: 'none',
        color: '#fff',
        backgroundColor: '#333',
        borderColor: '#333',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(178, 178, 178, 0.45)',
        },
        '&.Mui-selected': {
          backgroundColor: '#333',
          color: '#fff',
        }
      },
      contained: {
        '&:hover': {
          boxShadow: '0 2px 8px rgba(178, 178, 178, 0.45)',
        },
      },
      outlined: {
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(178, 178, 178, 0.45)',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(178, 178, 178, 0.45)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.main,
          },
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        fontWeight: 500,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 8px rgba(178, 178, 178, 0.45)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
      },
    },
  },
  MuiSnackbar: {
    styleOverrides: {
      root: {
        '& .MuiSnackbarContent-root': {
          borderRadius: 8,
        },
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        color: colors.text.primary,
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        color: 'black',
        backgroundColor: 'white',
        '&:hover': {
          backgroundColor: '#f0f0f0',
        },
        '&.Mui-selected': {
          backgroundColor: '#ffff00',
          color: 'black',
          '&:hover': {
            backgroundColor: '#ffff00',
            color: 'black',
          },
        },
      },
    },
  },
};

const theme = createTheme({
  palette: colors,
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

export default theme;
