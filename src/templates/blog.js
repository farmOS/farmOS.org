import React from 'react';
import { graphql } from 'gatsby'
import { Box } from '@material-ui/core';
import 'prismjs/themes/prism.css'
import Markdown from '../components/markdown';
import Seo from '../components/seo';

export default function BlogTemplate({ data }) {
  const { markdownRemark: post } = data;
  const title = post.headings.find(({ depth }) => depth === 1)?.value;

  return (
    <>
      <Seo title={title}/>
      <Box component='main'>
        <Markdown html={post.html}/>
      </Box>
    </>
  );
};

export const query = graphql`
  query($pathname: String!) {
    markdownRemark(fields: { pathname: { eq: $pathname } }) {
      html
      headings {
        id
        value
        depth
      }
    }
  }
`;
