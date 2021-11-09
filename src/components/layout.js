import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby-material-ui-components';
import {
  AppBar, Box, Container, CssBaseline, Drawer, Hidden,
  IconButton, Toolbar, Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import NestedNav from './nested-nav';
import theme, { toolbarOffset } from '../theme';

const contentWidth = 1280;
const lineLengthInChars = 90;
const lineLength = `${lineLengthInChars}ch`;
const sidebarWidth = `calc(calc(${contentWidth}px - ${lineLength}) / 2)`;
const sidebarOffset = `calc(50% + ${lineLengthInChars / 2}ch)`;

const useStyles = makeStyles({
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
    [theme.breakpoints.down('md')]: {
      marginLeft: `calc(50% - ${lineLengthInChars / 4}ch - ${contentWidth / 4 - 16}px)`,
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 'auto',
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

export default function Layout({ children, location }) {
  const [nav, setNav] = useState(null);
  useEffect(() => {
    const loadNav = async () => {
      const navigation = await import('../../.cache/__farmOS__navigation_tree.json');
      setNav(navigation);
    };
    loadNav();
  }, []);

  const classes = useStyles();
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
                  <Link to='/'>
                    farmOS 2.x Docs
                  </Link>
                </Typography>
            </Toolbar>
          </Container>
        </AppBar>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden lgUp implementation='css'>
          <Drawer
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
                farmOS 2.x Docs
              </Typography>
            </Box>
            <NestedNav
              nav={nav}
              currentPathname={location.pathname}
              handleNav={handleDrawerToggle}/>
          </Drawer>
        </Hidden>
        <Container className={classes.mainContainer}>
          <Hidden mdDown implementation='css' className={classes.mainNav}>
            <NestedNav nav={nav} currentPathname={location.pathname}/>
          </Hidden>
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
};
