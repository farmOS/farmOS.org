const visit = require('unist-util-visit');

module.exports = ({ markdownAST, markdownNode }, options = {}) => {
  const { prefix, test } = options;
  if (typeof prefix !== 'string') return markdownAST;
  
  const appendPrefix = () => {
    visit(markdownAST, 'link', (node) => {
      if (node && !node.url.startsWith('http')) {
        node.url = (prefix + node.url).replace(/\/\//, `/`);
      }
    });
  };

  const runTest = () => {
    const { field, value } = test;
    if (value === markdownNode.fields[field]) {
      appendPrefix();
    }
  };

  if (typeof test === 'object' && test !== null) {
    runTest();
  } else {
    appendPrefix();
  }

  return markdownAST;
}