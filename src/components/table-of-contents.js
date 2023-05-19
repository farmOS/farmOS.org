import { makeStyles } from 'tss-react/mui';
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useActiveHeading from '../hooks/useActiveHeading';

const useStyles = makeStyles()(theme => ({
  title: {
    fontWeight: 700,
  },
  headings: {
    '& > ul': {
      padding: 0,
      margin: 0,
    },
    '& ul ul': {
      paddingLeft: theme.spacing(2),
    },
    '& li': {
      listStyle: 'none',
      margin: `${theme.spacing(1)}px 0 0 0`,
    },
    '& p': {
      margin: 0,
    },
    '& a': {
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
  },
  active: {
    color: `${theme.palette.primary.light} !important`,
    fontWeight: 700,
  },  
}));

export default function TableOfContents(props) {
  const { classes } = useStyles();
  const { __html, headings, title = 'Table of contents' } = props;

  const [tocRef, setActiveHeading] = useActiveHeading(headings, classes.active);

  return (<>
    <Typography component='label' className={classes.title}>{title}</Typography>
    <Box
      ref={tocRef}
      className={classes.headings}
      dangerouslySetInnerHTML={{ __html }}
      onClick={setActiveHeading}/>
  </>);
}
