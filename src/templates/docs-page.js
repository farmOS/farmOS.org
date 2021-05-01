import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import '@fontsource/roboto'
import '@fontsource/roboto-mono'
import './roboto.css'

export default function DocsPage({ data }) {
  const post = data.markdownRemark
  return (
    <Layout toc={post.tableOfContents}>
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
    }
  }
`;
