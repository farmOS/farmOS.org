import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import { ThemeProvider } from '@material-ui/styles'
import 'prismjs/themes/prism.css'
import './docs.css';
import Layout from "../components/layout"
import Seo from "../components/seo"
import Markdown from '../components/markdown';
import navTree from '../utils/nav-tree'
import farmOSMkdocs from '/.cache/gatsby-source-git/farmOS/mkdocs.yml'
import theme from '../theme'

// Bit of a hack to map source names to their configs. Ideally this should be
// done in gatsby-config.js or a custom plugin, but this will suffice for now.
const sites = {
  farmOS: {
    root: '/farmos/docs/',
    title: 'farmOS 2.x Docs',
    mkdocs: farmOSMkdocs, // this seems especially hacky and brittle 😬
  },
};

export default function DocsPage({ data, location }) {
  const { markdownRemark: post, allMarkdownRemark } = data
  const source = post.fields.sourceInstanceName
  const config = sites[source];
  const nav = config.mkdocs
    ? navTree.fromMkdocsYaml(config)
    : navTree.fromRemarkNodes(allMarkdownRemark.nodes, config);
  const [tocHtml, setTocHtml] = useState(post.tableOfContents);
  const toc = {
    __html: tocHtml,
    title: post.headings.find(({ depth }) => depth === 1)?.value,
    headings: post.headings
      .filter(({ depth }) => depth > 1)
      .map(({ id }) => id),
  }
  useEffect(() => {
    const div = document.createElement('div');
    div.innerHTML = post.tableOfContents;
    const ul1 = div.querySelector('ul li ul');
    const ul2 = ul1 && ul1.outerHTML;
    setTocHtml(ul2);
  }, [post])
  return (
    <ThemeProvider theme={theme}>
      <Seo title={toc.title}/>
      <Layout toc={toc} nav={nav} location={location}>
        <Markdown html={post.html} />
      </Layout>
    </ThemeProvider>
  )
}

export const query = graphql`
  query($pathname: String!, $sourceInstanceName: String!) {
    markdownRemark(fields: { pathname: { eq: $pathname } }) {
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
      fields {
        sourceInstanceName
      }
    }
    allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: $sourceInstanceName } } }
    ) {
      nodes {
        fields {
          pathname
        }
        frontmatter {
          title
        }
      }
    }
  }
`;
