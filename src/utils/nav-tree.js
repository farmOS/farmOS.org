const dirname = pathname => {
  const segments = pathname.split('/');
  const result = `/${segments.slice(0, segments.length - 2).join('/')}/`
    .replace(/\/\//g, '/');
  return result || '/';
};
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

// Traverses a tree to find the DIRECT parent of a particular node and returns
// an array of indices to indicate its location in the tree. For example, if it
// returns [1, 2, 3], the parent will be at tree[1].children[2].children[3].
// The array can then be passed to insertChildNode.
const findParentNode = (tree, node, indices = []) => {
  let nearest = -1;
  for (let i = 0; i < tree.length; i++) {
    const next = tree[i];
    if (dirname(node.pathname) === next.pathname) {
      return indices.concat(i);
    }
    const isAncestor = node.pathname.includes(next.pathname);
    if (isAncestor) {
      const isNearer = nearest < 0 || next.pathname.includes(tree[nearest].pathname);
      if (isNearer) {
        nearest = i;
      }
    }
  }
  if (nearest < 0) {
    return [];
  }
  return findParentNode(tree[nearest].children, node, indices.concat(nearest));
};

// Takes a tree, a node, and an array of indices provided by findParentNode, and
// returns a shallow copy of the tree which includes the inserted child. This is
// done separately to keep the logic a little tidier, but also so buildNavTree
// has a chance to determine if the direct parent was found before trying to
// insert it.
const insertChildNode = (tree, node, indices) => {
  if (indices.length === 0) {
    return [ ...tree ];
  }
  const i = indices[0];
  const rest = indices.slice(1);
  const children = rest.length === 0
    ? tree[i].children.concat(node)
    : insertChildNode(tree[i].children, node, rest);
  const parent = { ...tree[i], children };
  return [
    ...tree.slice(0, i),
    parent,
    ...tree.slice(i + 1),
  ];
};

const createParentNode = node => {
  const pathname = dirname(node.pathname);
  const title = pathname
    .split('/')
    .filter(str => !!str)
    .pop()
    .split('-')
    .map(capitalize)
    .join(' ');
  const children = [{ ...node }];
  return { title, pathname, children, page: false };
};

export const buildNavTree = (nodes, rootPath = '/', tree = []) => {
  if (nodes.length === 0) {
    return tree;
  }
  const head = nodes[0];
  const tail = nodes.slice(1);
  if (head.pathname === rootPath) {
    const newTree = [{ ...head, children: tree }];
    return buildNavTree(tail, rootPath, newTree);
  }
  // Search the tree for the direct parent.
  const indices = findParentNode(tree, head);
  if (indices.length > 0) {
    const newTree = insertChildNode(tree, head, indices);
    return tail.length <= 0
      ? newTree
      : buildNavTree(tail, rootPath, newTree);
  }
  // Search the remaining nodes for the direct parent.
  const i = tail.findIndex(n => dirname(head.pathname) === n.pathname);
  if (i >= 0) {
    const parent = {
      ...tail[i],
      children: tail[i].children.concat(head),
    };
    const newTail = [
      parent,
      ...tail.slice(0, i),
      ...tail.slice(i + 1),
    ];
    return buildNavTree(newTail, rootPath, tree);
  }
  // Otherwise we need to create the parent.
  const parent = createParentNode(head);
  return buildNavTree([parent].concat(tail), rootPath, tree);
};

export const transformRemarkNodes = ({ node }) => {
  const { frontmatter: { title }, fields: { pathname } } = node;
  return { title, pathname, children: [], page: true };
};
