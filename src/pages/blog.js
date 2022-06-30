import * as React from 'react';
import { Link } from 'gatsby-material-ui-components';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import Seo from '../components/seo';
import theme from '../theme';
import { graphql } from 'gatsby';

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

const BlogIndex = ({ data: { allMarkdownRemark } }) => {
  const posts = allMarkdownRemark.edges.map(({ node }, i) => {
    const {
      excerpt,
      fields: { pathname },
      frontmatter: {title, date, },
    } = node;
    return (
    <Box component='a' href={pathname} key={i}>
      <Typography variant='h3'>{title}</Typography>
      <Typography variant='h5'>{date}</Typography>
      <Typography variant='body1'>{excerpt}</Typography>
    </Box>
    );
  });
  const classes = useStyles();
  return (
    <>
      <Seo title='farmOS | Blog'/>
      <Box component='main' className={classes.main}>
        <Typography variant='h1'>
          Blog Page!
        </Typography>
        <Typography variant='body1'>
          <Link to='/'>Return home</Link>.
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
    totalCount
    edges {
      node {
        frontmatter {
          canonical
          date(formatString: "MMMM DD, YYYY")
          slug
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
