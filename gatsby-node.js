const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const siteData = require('./site-data');
const { multiSlashRE } = require('./lib/fmt');
const { cacheSourceData, findSourceConfig } = require('./lib/sources');

const { defaultTemplate, localContent, gitSources } = siteData;

exports.onPostBootstrap = () => {
  cacheSourceData(localContent, gitSources);
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  // Ensures we are processing only markdown files
  if (node.internal.type === 'MarkdownRemark') {
    const { sourceInstanceName } = getNode(node.parent);
    const repoConfig = findSourceConfig(sourceInstanceName, gitSources);
    let pathname;
    if (typeof repoConfig === 'object') {
      const { parentURI = '', baseURI, directory } = repoConfig;
      const basePath = `.cache/gatsby-source-git/${sourceInstanceName}`;
      const relativeFilePath = createFilePath({
        node,
        getNode,
        basePath,
      }).replace(directory, '');
      pathname = `/${parentURI}/${baseURI}/${relativeFilePath}`
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
    const config = findSourceConfig(sourceInstanceName, gitSources);
    const { template = defaultTemplate } = config || {};
    const component = path.resolve(template);
    createPage({
      path: node.fields.pathname,
      component,
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        pathname: node.fields.pathname,
        sourceInstanceName: node.fields.sourceInstanceName,
      },
    });
  });
};
