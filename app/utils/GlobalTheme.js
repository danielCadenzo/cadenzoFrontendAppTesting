import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    primary: {
      light: '#7DB6CA',
      main: '#1D82A5',
      dark: '#444D67',
      contrastText: '#fff',
    },
    secondary: {
      light: '#22AF9A',
      main: '#22AF9A',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  overrides: {
    // Style sheet name ⚛️
    MuiButton: {
      // Name of the rule
      text: {
        // Some CSS
        color: 'white',
        background: '#1D82A5',
        '&:hover': {
          backgroundColor: '#7DB6CA',
        },
      },
    },
  },
});
