import * as React from "react"
import { Helmet } from "react-helmet";
import { Link } from 'gatsby-material-ui-components';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import theme from '../../../theme';

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

const JoinPage = () => {
  const classes = useStyles();
  return (
    <>
      <Helmet title="Redirecting to Jitsi...">
        <meta http-equiv="Refresh" content="0; URL=https://meet.jit.si/farmos-community"/>
      </Helmet>
        <Box component='main' className={classes.main}>
          <Typography variant='h1'>
            Redirecting to Jitsi...
          </Typography>
          <Typography variant='body1'>
            If you are not immediately redirected to the farmOS Community Jitsi room,&nbsp;
            <Link to="https://meet.jit.si/farmos-community">click here</Link>.
          </Typography>
        </Box>
    </>
  );
};

export default JoinPage;
