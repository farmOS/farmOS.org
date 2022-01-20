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

function fromConfigYaml(config, baseURI) {
  const root = fmtPath(baseURI);
  const { source_name, site_name, nav = [] } = config;
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

const loadConfigYaml = (path) => {
  if (typeof path !== 'string') return null;
  try {
    const file = fs.readFileSync(path);
    return jsYaml.load(file);    
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading source configuration:', error);
    return null;
  }
};

const pathToArray = pathname => pathname.split('/').filter(s => !!s);
const nearestCommonAncestor = (pathA, pathB, depth = 0) => {
  const [a, ...restA] = Array.isArray(pathA) ? pathA : pathToArray(pathA);
  const [b, ...restB] = Array.isArray(pathB) ? pathB : pathToArray(pathB);
  if (!a || !b || a !== b || restA.length < 1 || restB.length < 1) return depth;
  return nearestCommonAncestor(restA, restB, depth + 1);
};
const findParentNode = (node, baseURI = '/', indices = []) => {
  const pathname = node.page && node.page.pathname;
  if (pathname) {
    const nca = nearestCommonAncestor(pathname, baseURI);
    return indices.slice(0, nca);
  }
  let nearest = [];
  for (let i = 0; i < node.children.length; i++) {
    const sibling = node.children[i];
    const siblingIndices = findParentNode(sibling, baseURI, [...indices, i]);
    if (siblingIndices.length > nearest.length) {
      nearest = siblingIndices;
    }
  }
  return nearest;
};
const insertChildNode = (nav, child, indices) => {
  if (nav.key === '/' && child.key === '/') {
    // If the parent is root and the child has a key/baseURI of root,
    // hoist its children to the root level.
    const children = nav.children.concat(child.children);
    return { ...nav, children };
  }
  if (indices.length === 0) {
    const children = nav.children.concat(child);
    return { ...nav, children };
  }
  const [i, ...rest] = indices;
  return {
    ...nav,
    children: [
      ...nav.children.slice(0, i),
      insertChildNode(nav.children[i], child, rest),
      ...nav.children.slice(i + 1),
    ]
  };
};

const createSourceNav = (source) => {
  const { title, config, baseURI, page = null } = source;
  let nav = {
    title,
    key: baseURI,
    page,
    children: [],
  };
  const configYaml = loadConfigYaml(config);
  if (configYaml && Array.isArray(configYaml.nav)) {
    nav = fromConfigYaml(configYaml, baseURI);
  }
  return nav;
};

const defaultRoot = { title: 'Home', key: '/', page: null, children: [] };
const fromSources = (sources = [], parentNav = null) => {
  if (parentNav === null) {
    const i = sources.findIndex(s => s.baseURI === '/');
    if (i < 0) return fromSources(sources, defaultRoot);
    const rootSource = createSourceNav(sources[i]);
    const nestedSources = [
      ...sources.slice(0, i),
      ...sources.slice(i + 1),
    ];
    return fromSources(nestedSources, rootSource);
  };
  const [head, ...tail] = sources;
  if (!head) return parentNav;
  const sourceNav = createSourceNav(head);
  const indices = findParentNode(parentNav, head.baseURI);
  const nav = insertChildNode(parentNav, sourceNav, indices);
  if (tail.length === 0) return nav;
  return fromSources(tail, nav);
};

module.exports = {
  fromRemarkNodes,
  fromConfigYaml,
  fromSources,
};
