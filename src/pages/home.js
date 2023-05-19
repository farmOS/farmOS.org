import * as React from "react"
import { Link } from 'gatsby';
import { makeStyles } from 'tss-react/mui';
import { Box, Typography } from '@mui/material';
import Seo from '../components/seo';
import theme from "../theme";

const useStyles = makeStyles()({
  main: {
    '& h1': {
      color: theme.palette.text.secondary,
      fontWeight: 300,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-.01em',
      margin: '0 0 1.25rem',
    },
  },
});

const HomePage = () => {
  const { classes } = useStyles();
  return (
    <>
      <Seo title="farmOS | Home"/>
      <Box component='main' className={classes.main}>
        <Typography variant='h1'>
          Home Page!
        </Typography>
        <Typography variant='body1'>
          <Link to="/">Return home</Link>.
        </Typography>
      </Box>
    </>
  )
}

export default HomePage
