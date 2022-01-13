const fs = require('fs');
const jsYaml = require('js-yaml');
const { multiSlashRE, fmtPath } = require('./fmt');

const defaultTransform = title => title
  .split('-')
  .map(str => str.charAt(0).toUpperCase() + str.slice(1))
  .join(' ');

function createSubtree(upperPath, lowerPath, transform) {
  const nodes = lowerPath.replace(upperPath, '').split('/').filter(s => !!s);
  const [head, ...tail] = nodes;
  const title = transform(head);
  const pathname = `${upperPath}${head}/`;
  if (tail.length === 0) {
    return { key: pathname, title, page: null, children: [] };
  }
  const children = [createSubtree(pathname, lowerPath, transform)];
  return { key: pathname, title, page: null, children };
}

const insertRemarkNode = transform => (tree, node) => {
  const { frontmatter: { title }, fields: { pathname } } = node;
  if (pathname === tree.key) {
    return { ...tree, page: { title, pathname } };
  }
  const i = tree.children.findIndex(child => pathname.includes(child.key));
  let children;
  if (i < 0) {
    const subtree = createSubtree(tree.key, pathname, transform);
    children = [
      ...tree.children,
      insertRemarkNode(transform)(subtree, node),
    ];
  } else {
    children = [
      ...tree.children.slice(0, i),
      insertRemarkNode(transform)(tree.children[i], node),
      ...tree.children.slice(i + 1),
    ];
  }
  return { ...tree, children };
};

// This is not actually being used anymore, but may be needed in the future.
function fromRemarkNodes(pages, config = {}) {
  const {
    root = '/',
    title = 'Home',
    transform = defaultTransform,
  } = config;
  const tree = {
    key: root,
    title,
    page: {
      pathname: root,
      title,
    },
    children: [],
  };
  return pages.reduce(insertRemarkNode(transform), tree);
}

function fromMkdocsYaml(mkdocs, baseURI) {
  const root = fmtPath(baseURI);
  const { source_name, site_name, nav = [] } = mkdocs;
  const mdToPath = pathname => `${root}${pathname}`
    .replace('index.md', '')
    .replace('.md', '/')
    .replace(multiSlashRE, '/');
  function parseNavObject(navObj, i) {
    return Object.entries(navObj).map(([title, value]) => {
      const key = `${title.toLowerCase().replace(' ', '-')}-${i}`;
      const node = { key, title, page: null, children: [] };
      if (Array.isArray(value)) {
        node.children = value.map(parseNavObject);
      } else {
        const pathname = value.startsWith('http') ? value : mdToPath(value);
        node.page = { title, pathname };
      }
      return node;
    })[0];
  }
  return {
    key: root,
    title: source_name || site_name,
    children: nav.map(parseNavObject),
  };
}

const loadMkdocsYaml = (path) => {
  try {
    const file = fs.readFileSync(path);
    return jsYaml.load(file);    
  } catch (error) {
    console.error('Error loading source configuration:', error);
    return null;
  }
};

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
const fromSource = source => {
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
    const childNav = fromSource(childConfig);
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

const fromSources = sources => hoistRoot(fromSource(sources));

module.exports = {
  fromRemarkNodes,
  fromMkdocsYaml,
  fromSources,
};
