import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import { ThemeProvider } from '@material-ui/styles'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import 'prismjs/themes/prism.css'
import markdownStyles from './docs-markdown.css'
import Layout from "../components/layout"
import Seo from "../components/seo"
import { transformRemarkNodes, buildNavTree } from '../utils/nav-tree'
import theme from '../theme'

const useStyles = makeStyles({
  markdown: markdownStyles(theme),
});

// Bit of a hack to map source names to their basepath. Ideally this should be
// done in gatsby-config.js or a custom plugin, but this will suffice for now.
const rootPaths = {
  farmOS: '/farmos/docs/',
};

export default function DocsPage({ data }) {
  const classes = useStyles()
  const { markdownRemark: post, allMarkdownRemark } = data
  const rootPath = rootPaths[post.fields.sourceInstanceName]
  const navNodes = allMarkdownRemark.edges.map(transformRemarkNodes)
  const navTree = buildNavTree(navNodes, rootPath)
  // Unnest one level, b/c we don't want to include the rootPath
  const nav = navTree[0].children
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
      <Layout toc={toc} nav={nav}>
        <Typography
          className={classes.markdown}
          variant='body1'
          component='span'
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
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
      edges {
        node {
          fields {
            pathname
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
