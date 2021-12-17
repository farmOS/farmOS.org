const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');
const { createFilePath } = require('gatsby-source-filesystem');
const sourceRepos = require('./source-repos');
const { fromMkdocsYaml } = require('./src/navigation');

const normalizeSourceRepos = repos => repos.filter(({ name, mkdocs, baseURI }) => {
  let isValid = true, msg = 'Skipping source.';
  if (typeof name !== 'string') {
    isValid = false; msg = `${msg} Invalid name: ${name}.`;
  }
  if (typeof mkdocs !== 'string') {
    isValid = false; msg = `${msg} Invalid MkDocs path: ${mkdocs}.`;
  }
  if (typeof baseURI !== 'string') {
    isValid = false; msg = `${msg} Invalid base URI: ${baseURI}.`;
  }
  if (!isValid && process.env.NODE_ENV === 'development') console.warn(msg);
  return isValid;
}).map((config) => {
  const { name, mkdocs, parentPath = '/', children } = config;
  return ({
    name,
    ...config,
    parentPath,
    mkdocs: path.join('.cache/gatsby-source-git/', name, mkdocs),
    children: Array.isArray(children) ? normalizeSourceRepos(children) : [],
  });
});

const sources = {
  name: 'content',
  title: 'farmOS.org',
  baseURI: '/',
  mkdocs: 'src/content/config.yml',
  children: normalizeSourceRepos(sourceRepos),
};

const loadMkdocsYaml = (relPath, baseURI) => {
  const absPath = path.join(__dirname, relPath);
  const file = fs.readFileSync(absPath);
  const yaml = jsYaml.load(file);
  return fromMkdocsYaml(yaml, baseURI)
};

const multiSlashRE = /\/{2,}/g;
const fmtPath = str => `/${str}/`.replace(multiSlashRE, '/');
const pathToArray = pathname => pathname.split('/').filter(s => !!s);
const findParentNode = (node, parentPath = '/', indices = []) => {
  const pathname = node.page && node.page.pathname;
  if (pathname) {
    // Test if the node is either the direct parent of the child's baseURI, or
    // a descendent of the parent node.
    const pathLength = pathToArray(parentPath).length;
    const ancestor = pathToArray(pathname).slice(0, pathLength).join('/');
    const hasCommonAncestor = fmtPath(parentPath) === fmtPath(ancestor);
    if (hasCommonAncestor) return indices;
  }
  for (let i = 0; i < node.children.length; i++) {
    const sibling = node.children[i];
    const siblingIndices = findParentNode(sibling, parentPath, [...indices, i]);
    if (siblingIndices.length > indices.length) {
      return siblingIndices;
    }
  }
  return indices.slice(0, -1);
};
const insertChildNode = (parent, child, indices) => {
  const [i, ...rest] = indices;
  if (!i || rest.length === 0) return {
    ...parent,
    children: parent.children.concat(child),
  }
  return {
    ...parent,
    children: [
      ...parent.children.slice(0, i),
      insertChildNode(parent.children[i], child, rest),
      ...parent.children.slice(i + 1),
    ]
  };
};
const fromSourceConfig = config => {
  const { mkdocs, parentPath = '', baseURI, children } = config;
  const root = fmtPath(`${parentPath}/${baseURI}`);
  const nav = loadMkdocsYaml(mkdocs, root);
  if (!Array.isArray(children) || children.length < 1) return nav;
  return children.reduce((parentNav, childConfig) => {
    const indices = findParentNode(parentNav, childConfig.parentPath);
    const childNav = fromSourceConfig(childConfig);
    return insertChildNode(parentNav, childNav, indices);
  }, nav);
};

// Pulls sources with a key of '/' up to the root-level navigation.
const hoistRoot = nav => ({
  ...nav,
  children: nav.children.flatMap((child) => {
    if (child.key === '/') return child.children;
    return child;
  // Removes the "Home" route from nav.
  }).filter(({ page }) => !page || page.pathname !== '/'),
});

exports.onPostBootstrap = function cacheSourceData() {
  const navigation = hoistRoot(fromSourceConfig(sources));
  const json = JSON.stringify({ sources, navigation });
  const jsonPath = path.join(__dirname, '.cache/__farmOS__source_data.json');
  fs.writeFileSync(jsonPath, json);
};

const findRepoConfig = (name, sources = []) => {
  const [head, ...tail] = sources;
  if (!head || head.name === name) {
    return head;
  }
  if (Array.isArray(head.children)) {
    const config = findRepoConfig(name, head.children);
    if (config) return config;
  }
  if (tail.length > 0) {
    const config = findRepoConfig(name, tail);
    if (config) return config;
  }
  return undefined;
};
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
