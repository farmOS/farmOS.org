import { createTheme } from '@material-ui/core/styles';

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
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          overflowX: 'hidden',
        },
      },
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
