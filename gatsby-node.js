const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const sourceRepos = require('./source-repos');
const { cacheNavigationJSON } = require('./src/navigation');

exports.onPostBootstrap = cacheNavigationJSON;

const multiSlashRE = /\/{2,}/g;
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  // Ensures we are processing only markdown files
  if (node.internal.type === 'MarkdownRemark') {
    const { sourceInstanceName } = getNode(node.parent);
    const config = sourceRepos.find(c => c.name === sourceInstanceName);
    if (!config || typeof config !== 'object') {
      console.warn(`Cannot find configuration for source: ${sourceInstanceName}`);
      return;
    };
    const { baseURI, directory } = config;
    const basePath = `.cache/gatsby-source-git/${sourceInstanceName}`;
    const relativeFilePath = createFilePath({
      node,
      getNode,
      basePath,
    }).replace(directory, '');
    const pathname = `/${baseURI}/${relativeFilePath}`.replace(multiSlashRE, '/');

    // Add a field to each markdown node to indicate its source instance. This
    // is used by the gatsby-remark-prefix-relative-links plugin.
    createNodeField({
      node,
      name: 'sourceInstanceName',
      value: sourceInstanceName,
    });

    // Creates new query'able field with name of 'pathname'
    createNodeField({
      node,
      name: 'pathname',
      value: pathname,
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              pathname
              sourceInstanceName
            }
          }
        }
      }
    }
  `);
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.pathname,
      component: path.resolve(`./src/templates/docs-page.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        pathname: node.fields.pathname,
        sourceInstanceName: node.fields.sourceInstanceName,
      },
    });
  });
};
