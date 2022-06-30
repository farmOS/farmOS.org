const fs = require('fs');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const site = require('./site-data');
const { multiSlashRE } = require('./lib/fmt');
const { prepareSources } = require('./lib/sources');
const nav = require('./lib/navigation');

const { cache, defaultTemplate, git, sources: rawSources } = site;
const sources = prepareSources(rawSources, git);

exports.onPostBootstrap = () => {
  const navigation = nav.fromSources(sources);
  const json = JSON.stringify({ ...site, sources, navigation });
  fs.writeFileSync(cache, json);
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  // Ensures we are processing only markdown files
  if (node.internal.type === 'MarkdownRemark') {
    const { sourceInstanceName } = getNode(node.parent);
    const source = sources.find(s => s.name === sourceInstanceName);
    const { basePath, baseURI, directory, template = defaultTemplate } = source;
    const relativeFilePath = createFilePath({
      node,
      getNode,
      basePath,
    }).replace(directory, '');
    const slug = node.frontmatter && node.frontmatter.slug;
    const pathname = `/${baseURI}/${slug || relativeFilePath}`.replace(multiSlashRE, '/');

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

    createNodeField({
      node,
      name: 'template',
      value: template,
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
              template
            }
          }
        }
      }
    }
  `);
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const { fields: { pathname, sourceInstanceName, template } } = node;
    // Skip other /index.md pages so they don't overwrite content/index.md
    if (pathname === '/' && sourceInstanceName !== 'content') return;
    const component = path.resolve(template);
    createPage({
      path: pathname,
      component,
      // Context is available in page queries as GraphQL variables.
      context: { pathname, sourceInstanceName, template },
    });
  });
};
