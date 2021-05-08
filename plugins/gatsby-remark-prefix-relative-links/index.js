const visit = require('unist-util-visit');

// borrowed from gatsby-transformer-remark/src/extend-node-type.js
const withPathPrefix = (url, pathPrefix) => (pathPrefix + url).replace(/\/\//, `/`)

module.exports = ({ markdownAST, markdownNode }, options) => {
  const { sourceName, prefix = '' } = options || {};
  
  function visitor(node) {
    if (node && !node.url.startsWith('http')) {
      node.url = withPathPrefix(node.url, prefix);
    }
  }

  if (sourceName === markdownNode.fields.sourceName) {
    visit(markdownAST, 'link', visitor);
  }

  return markdownAST;
}