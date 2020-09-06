/**
 * Create element from an array of components.
 */
ax.node.array = function (array) {
  return ax.node.create({
    $nodes: array,
  });
};
