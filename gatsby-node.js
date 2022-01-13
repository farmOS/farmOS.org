const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const sourceRepos = require('./source-repos');
const { multiSlashRE } = require('./lib/fmt');
const { cacheSourceData, findRepoConfig } = require('./lib/sources');

exports.onPostBootstrap = cacheSourceData;

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  // Ensures we are processing only markdown files
  if (node.internal.type === 'MarkdownRemark') {
    const { sourceInstanceName } = getNode(node.parent);
    const repoConfig = findRepoConfig(sourceInstanceName, sourceRepos);
    let pathname;
    if (typeof repoConfig === 'object') {
      const { parentPath = '', baseURI, directory } = repoConfig;
      const basePath = `.cache/gatsby-source-git/${sourceInstanceName}`;
      const relativeFilePath = createFilePath({
        node,
        getNode,
        basePath,
      }).replace(directory, '');
      pathname = `/${parentPath}/${baseURI}/${relativeFilePath}`
        .replace(multiSlashRE, '/');
    } else {
      pathname = createFilePath({
        node,
        getNode,
        basePath: 'src/content',
      });
    }

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
    const { fields: { pathname, sourceInstanceName } } = node;
    // Skip other /index.md pages so they don't overwrite content/index.md
    if (pathname === '/' && sourceInstanceName !== 'content') return;
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
