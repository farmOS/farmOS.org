import React from 'react';
import {
  AppBar, Box, Container, CssBaseline, Drawer, Hidden,
  IconButton, Toolbar, Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import NestedNav from './nested-nav';
import nav from './nav-stub';
import theme from '../theme';

const contentWidth = 1280;
const lineLengthInChars = 75;
const lineLength = `${lineLengthInChars}ch`;
const sidebarWidth = `calc(calc(${contentWidth}px - ${lineLength}) / 2)`;
const sidebarOffset = `calc(50% + ${lineLengthInChars / 2}ch)`;

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
const toolbarOffset = toolbarOffsetWithMixin(theme.mixins.toolbar);

const useStyles = makeStyles({
  mainContainer: {
    ...toolbarOffset(({ minHeight }) => ({
      marginTop: minHeight,
    })),
    maxWidth: lineLength,
    position: 'relative',
    padding: 0,
    [theme.breakpoints.down('md')]: {
      marginLeft: `calc(50% - ${lineLengthInChars / 4}ch - ${contentWidth / 4}px)`,
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 'auto',
    },
    '& main': {
      width: lineLength,
      overflowX: 'hidden',
      '& pre': {
        overflowX: 'scroll',
      }
    }
  },
  toolbarContainer: {
    maxWidth: contentWidth,
    padding: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  drawerPaper: {
    width: sidebarWidth,
  },
  drawerHeader: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2)
  },
  mainNav: {
    ...toolbarOffset(({ minHeight }) => ({
      top: minHeight,
    })),
    position: 'fixed',
    right: sidebarOffset,
    width: sidebarWidth,
  },
  mainToC: {
    ...toolbarOffset(({ minHeight }) => ({
      top: minHeight,
    })),
    position: 'fixed',
    left: sidebarOffset,
    width: sidebarWidth,
    [theme.breakpoints.down('md')]: {
      left: `calc(50% + ${lineLengthInChars * 3 / 4}ch - ${contentWidth / 4}px)`,
    },
    '& label': {
      fontWeight: 700,
    },
    '& div > ul': {
      padding: 0,
    },
    '& li': {
      listStyle: 'none',
    },
  },
});

export default function Layout({ children, toc }) {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position='fixed'>
        <Container className={classes.toolbarContainer}>
          <Toolbar>
            <Hidden lgUp implementation='css'>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                edge='start'
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Typography variant='h6'>
              farmOS 2.x Docs
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden lgUp implementation='css'>
        <Drawer
          container={window.document.body}
          variant='temporary'
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <Box component='header' className={classes.drawerHeader}>
            <Typography variant='h6'>
              farmOS 2.x Docs
            </Typography>
          </Box>
          <NestedNav nav={nav} header='farmOS 2.x Docs'/>
        </Drawer>
      </Hidden>
      <Container className={classes.mainContainer}>
        <Hidden mdDown implementation='css' className={classes.mainNav}>
          <NestedNav nav={nav} header='farmOS 2.x Docs'/>
        </Hidden>
        <Box component='main'>
          {children}
        </Box>
        <Hidden smDown implementation='css' className={classes.mainToC}>
          <Typography component='label'>Table of contents</Typography>
          <Box dangerouslySetInnerHTML={{ __html: toc }}/>
        </Hidden>
      </Container>
    </ThemeProvider>
  );
};
