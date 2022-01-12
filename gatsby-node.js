const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');
const { createFilePath } = require('gatsby-source-filesystem');
const { compose, evolve, filter, map, mergeRight } = require('ramda');
const sourceRepos = require('./source-repos');
const { fromMkdocsYaml } = require('./src/navigation');

const validateSourceRepo = (source = {}) => {
  const { name, mkdocs, baseURI, remote } = source;
  let isValid = true, msg = 'Skipping source.';
  if (typeof name !== 'string') {
    isValid = false; msg = `${msg} Invalid name: ${name}.`;
  }
  if (mkdocs && typeof mkdocs !== 'string') {
    isValid = false; msg = `${msg} Invalid MkDocs path: ${mkdocs}.`;
  }
  if (typeof baseURI !== 'string') {
    isValid = false; msg = `${msg} Invalid base URI: ${baseURI}.`;
  }
  if (typeof remote !== 'string') {
    isValid = false; msg = `${msg} Invalid remote git url: ${remote}.`;
  }
  if (!isValid && process.env.NODE_ENV === 'development') console.warn(msg);
  return isValid;
};
const withDefaults = mergeRight({ parentPath: '/', children: [] });
const normalizeSourceRepo = config => evolve({
  mkdocs: dir => path.join('.cache/gatsby-source-git/', config.name, dir),
  children: compose(map(normalizeSourceRepo), filter(validateSourceRepo)),
}, withDefaults(config));

const sources = {
  name: 'content',
  title: 'farmOS.org',
  baseURI: '/',
  mkdocs: 'src/content/config.yml',
  children: map(normalizeSourceRepo, sourceRepos),
};

const loadMkdocsYaml = (relPath) => {
  try {
    const absPath = path.join(__dirname, relPath);
    const file = fs.readFileSync(absPath);
    return jsYaml.load(file);    
  } catch (error) {
    console.error('Error loading source configuration:', error);
    return null;
  }
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
const fromSources = source => {
  const { title, mkdocs, parentPath, baseURI, children } = source;
  const sourceURI = fmtPath(`${parentPath || ''}/${baseURI}`);
  const mkdocsYaml = loadMkdocsYaml(mkdocs);
  let nav = {
    title,
    key: sourceURI,
    page: sourceURI, // TODO: When should this be null?
    children: [],
  };
  if (mkdocsYaml && Array.isArray(mkdocsYaml.nav)) {
    nav = fromMkdocsYaml(mkdocsYaml, sourceURI);
  }
  if (!Array.isArray(children) || children.length < 1) return nav;
  return children.reduce((parentNav, childConfig) => {
    const indices = findParentNode(parentNav, childConfig.parentPath);
    const childNav = fromSources(childConfig);
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
  const navigation = hoistRoot(fromSources(sources));
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
