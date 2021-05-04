import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import '@fontsource/roboto'
import '@fontsource/roboto-mono'
import './roboto.css'

function stripDepthOneHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.querySelector('ul li ul').outerHTML;
}

export default function DocsPage({ data }) {
  const post = data.markdownRemark
  const toc = {
    __html: stripDepthOneHTML(post.tableOfContents),
    title: post.headings.find(({ depth }) => depth === 1).value,
    headings: post.headings
      .filter(({ depth }) => depth > 1)
      .map(({ id }) => id),
  }
  return (
    <Layout toc={toc}>
      <div>
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
      tableOfContents
      headings {
        id
        value
        depth
      }
    }
  }
`;
