import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby'
import 'prismjs/themes/prism.css'
import Markdown from '../components/markdown';
import { Box, Container } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import Seo from '../components/seo';
import TableOfContents from '../components/table-of-contents';
import theme, { toolbarOffset } from '../theme';

const contentWidth = 1200;
const lineLengthInChars = 80;
const lineLength = `${lineLengthInChars}ch`;
const sidebarWidth = `calc(calc(${contentWidth}px - ${lineLength})/2)`;
const sidebarOffset = `calc(50% + ${lineLengthInChars / 2}ch)`;

const useStyles = makeStyles()({
  mainToC: {
    position: 'fixed',
    ...toolbarOffset(({ minHeight }) => ({
      top: minHeight,
      bottom: minHeight,
    })),
    left: sidebarOffset,
    overflowY: 'auto',
    width: sidebarWidth,
    [theme.breakpoints.down('lg')]: {
      left: `calc(50% + ${lineLengthInChars * 3 / 4}ch - ${contentWidth / 4}px)`,
    },
    padding: theme.spacing(2),
  },
});

export default function DocsPage({ data }) {
  const { classes } = useStyles();

  const { markdownRemark: post } = data;
  const [tocHtml, setTocHtml] = useState(post.tableOfContents);
  const title = post.headings.find(({ depth }) => depth === 1)?.value;
  const toc = {
    title,
    __html: tocHtml,
    headings: post.headings
      .filter(({ depth }) => depth > 1)
      .map(({ id }) => id),
  };
  useEffect(() => {
    const div = document.createElement('div');
    div.innerHTML = post.tableOfContents;
    const ul1 = div.querySelector('ul li ul');
    const ul2 = ul1 && ul1.outerHTML;
    setTocHtml(ul2);
  }, [post.tableOfContents]);

  return (
    <>
      <Seo title={title}/>
      <Box component='main'>
        <Markdown html={post.html}/>
      </Box>
      {(
        toc.__html
        ? (<Container
            sx={{ display: {xs: 'none', md: 'block'}}}
            className={classes.mainToC}>
            <TableOfContents {...toc}/>
          </Container>)
        : null
      )}
    </>
  );
}

export const query = graphql`
  query($pathname: String!) {
    markdownRemark(fields: { pathname: { eq: $pathname } }) {
      html
      tableOfContents
      headings {
        id
        value
        depth
      }
    }
  }
`;
