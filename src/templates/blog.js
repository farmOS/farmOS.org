import React from 'react';
import { graphql } from 'gatsby';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import 'prismjs/themes/prism.css';
import theme from '../theme';
import Markdown from '../components/markdown';
import Seo from '../components/seo';

const DEFAULT_AUTHOR = 'the farmOS Community';
const DEFAULT_TITLE = 'farmOS Community Blog';

const useStyles = makeStyles({
  heading: {
    margin: '0 0 1.25rem',
  },
  headline: {
    fontWeight: 300,
    fontSize: '3rem',
    lineHeight: 1.3,
  },
  byline: {
    fontSize: '1rem',
    lineHeight: 1.3,
    color: theme.palette.text.secondary,
  },
  dateline: {
    fontWeight: 700,
  },
});

export default function BlogTemplate({ data }) {
  const classes = useStyles();
  const { markdownRemark: { frontmatter = {}, headings } } = data;
  const { canonical, date } = frontmatter;
  let { markdownRemark: { html } } = data;
  let { author, title } = frontmatter;
  if (!author) author = DEFAULT_AUTHOR;
  const h1 = headings.find(({ depth }) => depth === 1);
  if (h1) {
    const div = document.createElement('div');
    div.innerHTML = html;
    div.querySelector(`#${h1.id}`).remove();
    html = div.outerHTML;
  }
  if (!title && h1) title = h1.value;
  if (!title && !h1) title = DEFAULT_TITLE;

  return (
    <>
      <Seo title={title} canonical={canonical}/>
      <Box component='main'>
        <Box className={classes.heading}>
          <Typography variant='h3' className={classes.headline}>
            {title}
          </Typography>
          <Typography variant='h5' className={classes.byline}>
            <span className={classes.dateline}>{date}</span> by {author}
          </Typography>
        </Box>
        <Markdown html={html}/>
      </Box>
    </>
  );
};

export const query = graphql`
  query($pathname: String!) {
    markdownRemark(fields: { pathname: { eq: $pathname } }) {
      frontmatter {
        author
        canonical
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
      html
      headings {
        id
        value
        depth
      }
    }
  }
`;
