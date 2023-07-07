import React from 'react';
import { Link } from 'gatsby';
import {
  AppBar, Box, Button, Container, CssBaseline, Drawer,
  IconButton, Toolbar, Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from 'tss-react/mui';
import { ThemeProvider } from '@mui/material/styles';
import NestedNav from './nested-nav';
import theme, { toolbarOffset } from '../theme';

const contentWidth = 1200;
const lineLengthInChars = 80;
const lineLength = `${lineLengthInChars}ch`;
const sidebarWidth = `calc(calc(${contentWidth}px - ${lineLength}) / 2)`;
const sidebarOffset = `calc(50% + ${lineLengthInChars / 2}ch)`;

const useStyles = makeStyles()({
  layoutContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  mainContainer: {
    ...toolbarOffset(({ minHeight }) => ({
      marginTop: minHeight,
    })),
    maxWidth: lineLength,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: theme.spacing(2),
    [theme.breakpoints.down('lg')]: {
      marginLeft: `0`,
    },
    '& main': {
      maxWidth: lineLength,
      flexGrow: 1,
    },
  },
  toolbarContainer: {
    maxWidth: contentWidth,
    padding: 0,
    '& a': {
      color: theme.palette.primary.contrastText,
    },
    '& a:hover': {
      textDecoration: 'none',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  demoButton: {
    borderColor: 'white',
    textTransform: 'none',
  },
  drawerPaper: {
    width: sidebarWidth,
  },
  drawerHeader: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
    '& a': {
      color: theme.palette.primary.contrastText,
    },
    '& a:hover': {
      textDecoration: 'none',
    },
  },
  mainNav: {
    position: 'fixed',
    ...toolbarOffset(({ minHeight }) => ({
      top: minHeight,
      bottom: minHeight,
    })),
    right: sidebarOffset,
    overflowY: 'auto',
    width: sidebarWidth,
    padding: theme.spacing(2),
  },
  footer: {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.grey[500],
    '& a': {
      color: theme.palette.grey[500],
      textDecoration: 'none',
    },
    '& a:hover': {
      color: theme.palette.grey[300],
    },
  },
  copyright: {
    maxWidth: contentWidth,
    padding: theme.spacing(2),
  },
});

export default function Layout({ children, pathname }) {
  const [nav, setNav] = React.useState(null);
  React.useEffect(() => {
    const loadNav = async () => {
      const { navigation } = await import('../../.cache/__farmOS__.json');
      setNav(navigation);
    };
    loadNav();
  }, []);

  const { classes } = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.layoutContainer}>
        <CssBaseline />
        <AppBar position='fixed'>
          <Container className={classes.toolbarContainer}>
            <Toolbar>
                <IconButton
                  sx={{ display: {xs: 'block', lg: 'none'}}}
                  color='inherit'
                  aria-label='open drawer'
                  edge='start'
                  onClick={handleDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant='h6' style={{ flex: 1 }}>
                  <Link to='/'>
                    farmOS
                  </Link>
                </Typography>
                <Button
                  variant='outlined'
                  size='large'
                  href='https://farmos-demo.rootedsolutions.io'
                  target='_blank'
                  className={classes.demoButton}
                > 
                  Demo farmOS
                </Button>
            </Toolbar>
          </Container>
        </AppBar>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          sx={{ display: {xs: 'block', lg: 'none'}}}
          variant='temporary'
          anchor='left'
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
              <Link to='/' onClick={handleDrawerToggle}>
                farmOS
              </Link>
            </Typography>
          </Box>
          <NestedNav
            nav={nav}
            currentPathname={pathname}
            handleNav={handleDrawerToggle}/>
        </Drawer>
        <Container className={classes.mainContainer}>
          <NestedNav 
            className={classes.mainNav}
            sx={{ display: {xs: 'none', lg: 'block'}}}
            nav={nav}
            currentPathname={pathname}
          />
          {children}
        </Container>
        <Box component='footer' className={classes.footer}>
          <Container className={classes.copyright}>
            <Typography variant="caption">
              This work is licensed under a&nbsp;
              <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
              </a>.&nbsp;
              farmOS is a <a href="/community/trademark">registered trademark</a>&nbsp;
              of <a href="http://mstenta.net">Michael Stenta</a>.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
