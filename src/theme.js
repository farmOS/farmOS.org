import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#60945e',
      main: '#336633',
      dark: '#013b0b',
      contrastText: '#fff',
    },
    secondary: {
      light: '#5e5586',
      main: '#322c59',
      dark: '#0b022f',
      contrastText: '#fff',
    },
  },
});

export default theme;
