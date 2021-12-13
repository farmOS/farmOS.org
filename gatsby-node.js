const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');
const { createFilePath } = require('gatsby-source-filesystem');
const sourceRepos = require('./source-repos');
const { fromMkdocsYaml } = require('./src/navigation');

exports.onPostBootstrap = function cacheSourceData() {
  const sourceData = sourceRepos.filter(({ name, mkdocs, baseURI }) => {
    let isValid = true, msg = 'Skipping source.';
    if (typeof name !== 'string') {
      isValid = false; msg = `${msg} Invalid name: ${name}.`
    }
    if (typeof mkdocs !== 'string') {
      isValid = false; msg = `${msg} Invalid MkDocs path: ${mkdocs}.`
    }
    if (typeof baseURI !== 'string') {
      isValid = false; msg = `${msg} Invalid base URI: ${baseURI}.`
    }
    if (!isValid && process.env.NODE_ENV === 'development') console.warn(msg);
    return isValid;
  }).map((config) => {
    const { name, mkdocs, baseURI } = config;
    const mkdocsPath = path.join(__dirname, '.cache/gatsby-source-git/', name, mkdocs);
    const file = fs.readFileSync(mkdocsPath);
    const yaml = jsYaml.load(file);
    const navigation = fromMkdocsYaml(yaml, baseURI);
    return { ...config, navigation };
  });
  const json = JSON.stringify(sourceData);
  const jsonPath = path.join(__dirname, '.cache/__farmOS__source_data.json');
  fs.writeFileSync(jsonPath, json);
};

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
            parent {
              ... on File {
                gitRemote {
                  webLink
                }
              }
            }
          }
        }
      }
    }
  `);
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const sourceLink = node.parent.gitRemote ? node.parent.gitRemote.webLink : null;
    createPage({
      path: node.fields.pathname,
      component: path.resolve(`./src/templates/docs-page.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        pathname: node.fields.pathname,
        sourceInstanceName: node.fields.sourceInstanceName,
        sourceLink,
      },
    });
  });
};
