// These styles are based closely on https://github.com/squidfunk/mkdocs-material.
// It may be necessary to modify or remove them if and when we adopt a common
// typographic scale for the whole site. Unminified CSS from mkdocs-material:
// https://gist.github.com/jgaehring/a3142d9e0c2732031d8c43cf87e4eda6
const markdownStyles = theme => ({
  [`
    & blockquote,
    & dl,
    & figure,
    & ol,
    & pre,
    & ul
  `]: {
    margin: '1rem 0',
  },
  '& h1': {
    color: theme.palette.text.secondary,
    fontWeight: 300,
    fontSize: '2rem',
    lineHeight: 1.3,
    letterSpacing: '-.01em',
    margin: '0 0 1.25rem',
  },
  '& h2': {
    fontWeight: 300,
    fontSize: '1.5625rem',
    lineHeight: 1.4,
    letterSpacing: '-.01em',
    margin: '1.6rem 0 .64rem',
  },
  '& h3': {
    fontWeight: 400,
    fontSize: '1.25rem',
    lineHeight: 1.5,
    letterSpacing: '-.01em',
    margin: '1.6rem 0 .8rem',
  },
  '& h4': {
    fontWeight: 700,
    lineHeight: 1.6,
    letterSpacing: '-.01em',
    margin: '1rem 0',
  },
  '& h5, & h6': {
    color: theme.palette.text.secondary,
    fontWeight: 700,
    fontSize: '.8rem',
    lineHeight: 1.6,
    letterSpacing: '-.01em',
    margin: '1.25rem 0',
  },
  '& h5': {
    textTransform: 'uppercase',
  },
  '& hr': {
    display: 'flow-root',
    margin: '1.5rem 0',
    borderBottom: `0.05rem solid ${theme.palette.divider}`,
  },
  '& a': {
    color: theme.palette.primary.light,
    fontWeight: 400,
    wordBreak: 'break-word',
    textDecoration: 'none',
  },
  '& pre': {
    overflow: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: `${theme.palette.grey[400]}`
  },
  '& pre:hover': {
    scrollbarColor: `${theme.palette.grey[700]}`
  },
  '& pre::-webkit-scrollbar': {
    width: '.3rem',
    height: '.3rem',
  },
  '& pre::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[400],
  },
  '& pre::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.grey[700],
  },
  '& blockquote': {
    display: 'flow-root',
    paddingLeft: '0.6rem',
    color: theme.palette.text.secondary,
    borderLeft: `.2rem solid ${theme.palette.grey[400]}`
  },
  '& ul': {
    listStyleType: 'disc',
  },
  '& ol, & ul': {
    display: 'flow-root',
    marginLeft: '0.625rem',
    padding: 0,
  },
  '& ol ol, & ul ol': {
    listStyleType: 'lower-alpha',
  },
  '& ol ol ol, & ul ol ol': {
    listStyleType: 'lower-roman',
  },
  '& ol li, & ul li': {
    margin: '0 0 .5rem 1.25rem',
  },
  [`
    & ol li blockquote,
    & ol li p,
    & ul li blockquote,
    & ul li p
  `]: {
    margin: '.5rem 0',
  },
  '& ol li:last-child, & ul li:last-child': {
    marginBottom: 0,
  },
  [`
    & ol li ol
    & ol li ul
    & ul li ol
    & ul li ul
  `]: {
    margin: '.5rem 0 .5rem .625rem',
  },
});

export default markdownStyles;
