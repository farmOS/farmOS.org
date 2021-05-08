const visit = require('unist-util-visit');

module.exports = ({ markdownAST, markdownNode }, options) => {
  const { prefix, test } = options || {};
  
  const appendPrefix = pathPrefix => {
    visit(markdownAST, 'link', (node) => {
      if (node && !node.url.startsWith('http')) {
        node.url = (pathPrefix + node.url).replace(/\/\//, `/`);
      }
    });
  };

  const runTest = ({ field, value, prefix: testPrefix }) => {
    if (value === markdownNode.fields[field]) {
      appendPrefix(testPrefix);
    }
  };

  if (typeof prefix === 'string') {
    appendPrefix(prefix);
  } else if (Array.isArray(test)) {
    test.forEach(runTest);
  } else if (typeof test === 'object' && test !== null) {
    runtTest(test);
  }

  return markdownAST;
}