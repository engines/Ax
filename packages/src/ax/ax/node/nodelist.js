/**
 * Create element for a nodelist.
 */
ax.node.nodelist = function (nodelist) {
  return ax.node.create({
    $nodes: Array.from(nodelist),
  });
};
