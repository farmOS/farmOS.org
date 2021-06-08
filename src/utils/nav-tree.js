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

function fromMkdocsYaml(config) {
  const { root, mkdocs: { site_name, nav } } = config;
  const mdToPath = path => `${root}${path.replace('index.md', '').replace('.md', '/')}`;
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
          pathname: mdToPath(value),
        },
        children: [],
      };
    })[0];
  }
  return {
    key: root,
    title: site_name,
    page: {
      pathname: root,
      title: site_name,
    },
    children: nav.map(parseNavObject),
  };
}

const navTree = {
  fromRemarkNodes,
  fromMkdocsYaml,
};

export default navTree;
