import { createTheme } from '@mui/material/styles';

const theme = createTheme({
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
  components: {
    MuiCssBaseline: {
      styleOverrides: () => ({
        html: {
          height: '100%',
          overflowX: 'hidden',
        },
        body: {
          height: '100%',
          backgroundColor: '#fafafa',
        },
        '#___gatsby, #gatsby-focus-wrapper': {
          all: 'inherit',
          marginTop: '0',
        },
        '[id], [name]': {
          scrollMarginTop: '64px'
        },
        'a': {
          textDecoration: 'none',
        }
      }),
    },
  },
});

export default theme;

const isMediaQuery = key => key.startsWith('@');
const toolbarOffsetWithMixin = toolbar => fn => Object.entries(toolbar)
  .reduce((offsets, [prop, val]) => {
    if (isMediaQuery(prop)) {
      return {
        ...offsets,
        [prop]: toolbarOffsetWithMixin(val)(fn),
      };
    }
    return {
      ...offsets,
      ...fn({ [prop]: val }),
    };
  }, {});

export const toolbarOffset = toolbarOffsetWithMixin(theme.mixins.toolbar);
