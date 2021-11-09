import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby'
import 'prismjs/themes/prism.css'
import Markdown from '../components/markdown';
import { Box, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TableOfContents from '../components/table-of-contents';
import theme, { toolbarOffset } from '../theme';

const contentWidth = 1280;
const lineLengthInChars = 90;
const lineLength = `${lineLengthInChars}ch`;
const sidebarWidth = `calc(calc(${contentWidth}px - ${lineLength}) / 2)`;
const sidebarOffset = `calc(50% + ${lineLengthInChars / 2}ch)`;

const useStyles = makeStyles({
  mainToC: {
    ...toolbarOffset(({ minHeight }) => ({
      top: minHeight,
    })),
    position: 'fixed',
    left: sidebarOffset,
    width: sidebarWidth,
    [theme.breakpoints.down('md')]: {
      left: `calc(50% + ${lineLengthInChars * 3 / 4}ch - ${contentWidth / 4}px)`,
    },
    padding: theme.spacing(2),
  },
});

export default function DocsPage({ data }) {
  const classes = useStyles();

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
  console.log('toc', post.tableOfContents)

  return (
    <>
      <Box component='main'>
        <Markdown html={post.html}/>
      </Box>
      {(
        toc.__html
        ? (<Hidden smDown implementation='css' className={classes.mainToC}>
            <TableOfContents {...toc}/>
          </Hidden>)
        : null
      )}
    </>
  );
};

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
