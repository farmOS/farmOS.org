import * as React from 'react';
import { Link } from 'gatsby';
import { makeStyles } from 'tss-react/mui';
import { Box, Typography } from '@mui/material';
import Seo from '../components/seo';
import theme from '../theme';
import { graphql } from 'gatsby';

const DEFAULT_AUTHOR = 'the farmOS Community';
const DEFAULT_TITLE = 'farmOS Community Blog';

const useStyles = makeStyles()({
  main: {
    '& h1': {
      fontWeight: 300,
      fontSize: '3rem',
      lineHeight: 1.3,
      letterSpacing: '-.01em',
      margin: '0 0 1.25rem',
    },
  },
  post: {
    color: 'inherit',
    textDecoration: 'none',
    '& div': { paddingBottom: '2rem' },
    '& h3': {
      color: theme.palette.primary.light,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    '& h5': {
      fontSize: '1rem',
      lineHeight: 1.3,
      '& span': {
        fontWeight: 700,
      },
    },
    '& p': {
      color: theme.palette.text.hint,
    },
    '&:hover': {
      textDecoration: 'none',
      '& h3': { color: theme.palette.warning.main },
    },
  },
});

const BlogIndex = ({ data: { allMarkdownRemark } }) => {
  const { classes } = useStyles();
  const posts = allMarkdownRemark.edges.map(({ node }, i) => {
    const {
      excerpt, fields: { pathname }, frontmatter, headings,
    } = node;
    const { author, date, title } = frontmatter;
    const h1 = headings.find(({ depth }) => depth === 1);
    return (
      <Link to={pathname} key={i} className={classes.post}>
        <Box>
          <Typography variant='h3'>
            {title || h1?.value || DEFAULT_TITLE}
          </Typography>
          <Typography variant='h5'>
            <span>{date}</span> by {author || DEFAULT_AUTHOR}
          </Typography>
          <Typography variant='body1'>{excerpt}</Typography>
        </Box>
      </Link>
    );
  });
  return (
    <>
      <Seo title='farmOS | Blog'/>
      <Box component='main' className={classes.main}>
        <Typography variant='h1'>
          Community Blog
        </Typography>
        {posts}
      </Box>
    </>
  );
};

export const query = graphql`query BlogIndex {
  allMarkdownRemark(
    filter: {fields: {template: {eq: "./src/templates/blog.js"}}}
    sort: {frontmatter: {date: DESC}}
  ) {
    edges {
      node {
        frontmatter {
          author
          date(formatString: "MMMM DD, YYYY")
          title
        }
        excerpt
        fields {
          pathname
        }
        headings {
          value
          depth
        }
      }
    }
  }
}`;

export default BlogIndex
