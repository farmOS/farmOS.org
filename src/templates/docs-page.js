import React from "react"
import { graphql } from "gatsby"
import { ThemeProvider } from '@material-ui/styles'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import 'prismjs/themes/prism.css'
import markdownStyles from './docs-markdown.css'
import Layout from "../components/layout"
import theme from '../theme'

function stripDepthOneHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const h2AndUp = div.querySelector('ul li ul');
  return h2AndUp && h2AndUp.outerHTML;
}

const useStyles = makeStyles({
  markdown: markdownStyles(theme),
});

export default function DocsPage({ data }) {
  const classes = useStyles()
  const post = data.markdownRemark
  const toc = {
    __html: stripDepthOneHTML(post.tableOfContents),
    title: post.headings.find(({ depth }) => depth === 1).value,
    headings: post.headings
      .filter(({ depth }) => depth > 1)
      .map(({ id }) => id),
  }
  return (
    <ThemeProvider theme={theme}>
      <Layout toc={toc}>
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
