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

const multiSlashRE = /\/{2,}/g;
const fmtRoot = str => `/${str}/`.replace(multiSlashRE, '/');

function fromMkdocsYaml(mkdocs, baseURI) {
  const root = fmtRoot(baseURI);
  const { source_name, site_name, nav = [] } = mkdocs;
  const mdToPath = path => `${root}${path}`
    .replace('index.md', '')
    .replace('.md', '/')
    .replace(multiSlashRE, '/');
  const fmtPath = path => path.startsWith('http') ? path : mdToPath(path);
  function parseNavObject(navObj, i) {
    return Object.entries(navObj).map(([title, value]) => {
      const key = `${title.toLowerCase().replace(' ', '-')}-${i}`;
      if (Array.isArray(value)) {
        return {
          key,
          title,
          page: null,
          children: value.map(parseNavObject),
        };
      }
      return {
        key,
        title,
        page: {
          title,
          pathname: fmtPath(value),
        },
        children: [],
      };
    })[0];
  }
  return {
    key: root,
    title: source_name || site_name,
    children: nav.map(parseNavObject),
  };
}

module.exports = {
  fromRemarkNodes,
  fromMkdocsYaml,
};
