import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import { ThemeProvider } from '@material-ui/styles'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import 'prismjs/themes/prism.css'
import markdownStyles from './docs-markdown.css'
import Layout from "../components/layout"
import Seo from "../components/seo"
import theme from '../theme'

const useStyles = makeStyles({
  markdown: markdownStyles(theme),
});

export default function DocsPage({ data }) {
  const classes = useStyles()
  const post = data.markdownRemark
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
