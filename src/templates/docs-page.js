import React from 'react';
import { graphql } from 'gatsby'
import 'prismjs/themes/prism.css'
import Markdown from '../components/markdown';

export default function DocsPage({ data }) {
  const { markdownRemark: post } = data;
  return <Markdown html={post.html}/>;
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
