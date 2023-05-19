import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import 'prismjs/themes/prism.css';
import markdownStyles from './markdown.css';
import theme from '../theme';

const useStyles = makeStyles()({
  markdown: markdownStyles(theme),
});

export default function Markdown({ html }) {
  const { classes } = useStyles();
  return <Typography
    className={classes.markdown}
    variant='body1'
    component='span'
    dangerouslySetInnerHTML={{ __html: html }}
  />
}
