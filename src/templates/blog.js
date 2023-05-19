import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import { makeStyles } from 'tss-react/mui';
import { Box, Typography } from '@mui/material';
import 'prismjs/themes/prism.css';
import theme from '../theme';
import Markdown from '../components/markdown';
import Seo from '../components/seo';

const DEFAULT_AUTHOR = 'the farmOS Community';
const DEFAULT_TITLE = 'farmOS Community Blog';

const useStyles = makeStyles()({
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
  const { classes } = useStyles();
  const { markdownRemark: { frontmatter = {}, headings, html: initHtml } } = data;
  const { canonical, date } = frontmatter;
  let { author, title } = frontmatter;
  if (!author) author = DEFAULT_AUTHOR;
  const h1 = headings.find(({ depth }) => depth === 1);
  if (!title && h1) title = h1.value;
  if (!title && !h1) title = DEFAULT_TITLE;
  const [html, setHtml] = useState(initHtml);
  useEffect(() => {
    if (h1) {
      const div = document.createElement('div');
      div.innerHTML = html;
      const el = div.querySelector(`#${h1.id}`);
      if (el) {
        el.remove();
        setHtml(div.outerHTML);
      }
    }
  }, [h1, html]);

  return (
    <>
      <Seo title={title} canonical={canonical}/>
      <Box component='main'>
        <Box className={classes.heading}>
          <Typography variant='h1' className={classes.headline}>
            {title}
          </Typography>
          <Typography className={classes.byline}>
            <span className={classes.dateline}>{date}</span> by {author}
          </Typography>
        </Box>
        <Markdown html={html}/>
      </Box>
    </>
  );
}

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
