import * as React from "react"
import { Link } from 'gatsby-material-ui-components';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import Seo from '../components/seo';
import theme from "../theme";

const useStyles = makeStyles({
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

const NotFoundPage = () => {
  const classes = useStyles();
  return (
    <>
      <Seo title="Not found"/>
      <Box component='main' className={classes.main}>
        <Typography variant='h1'>
          404 - Not found
        </Typography>
        <Typography variant='p'>
          <Link to="/">Return home</Link>.
        </Typography>
      </Box>
    </>
  )
}

export default NotFoundPage
