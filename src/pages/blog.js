import * as React from 'react';
import { Link } from 'gatsby-material-ui-components';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import Seo from '../components/seo';
import theme from '../theme';
import { graphql } from 'gatsby';

const DEFAULT_AUTHOR = 'the farmOS Community';

const useStyles = makeStyles({
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
  const classes = useStyles();
  const posts = allMarkdownRemark.edges.map(({ node }, i) => {
    const {
      excerpt,
      fields: { pathname },
      frontmatter: { author = DEFAULT_AUTHOR, date, title, },
    } = node;
    return (
      <Link to={pathname} key={i} className={classes.post}>
        <Box>
          <Typography variant='h3'>{title}</Typography>
          <Typography variant='h5'>
            <span>{date}</span> by {author}
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
    filter: { fields: { template: { eq: "./src/templates/blog.js" } } }
    sort: {fields: frontmatter___date, order: DESC}
  ) {
    edges {
      node {
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
        }
        excerpt
        fields {
          pathname
        }
      }
    }
  }
}`;

export default BlogIndex
