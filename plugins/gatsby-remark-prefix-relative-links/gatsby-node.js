exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  // Ensures we are processing only markdown files
  if (node.internal.type === "MarkdownRemark") {
    const { sourceInstanceName } = getNode(node.parent);

    createNodeField({
      node,
      name: 'sourceName',
      value: sourceInstanceName,
    });
  }
};
