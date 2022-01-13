const visit = require('unist-util-visit');
const { multiSlashRE } = require('../../lib/fmt');

module.exports = ({ markdownAST, markdownNode }, options = {}) => {
  const { prefix, test } = options;
  if (typeof prefix !== 'string') return markdownAST;
  
  const appendPrefix = () => {
    visit(markdownAST, 'link', (node) => {
      if (!node || !node.url) return;
      const isAbsolute = node.url.startsWith('http');
      const isFragment = node.url.startsWith('#');
      const requiresPrefix = !isAbsolute && !isFragment;
      if (requiresPrefix) {
        node.url = `${prefix}/${node.url}`
          .replace('index.md', '')
          .replace('.md', '/')
          .replace(multiSlashRE, '/');
      }
    });
  };

  if (typeof test === 'object' && test !== null) {
    const { field, value } = test;
    if (value === markdownNode.fields[field]) {
      appendPrefix();
    }
  } else {
    appendPrefix();
  }

  return markdownAST;
}