/**
 * Node pre-processor that accepts various component types
 * and returns a node.
 */
ax.node = function (node) {
  if (ax.is.node(node) || ax.is.nodelist(node) ) return node;
  if (ax.is.string(node)) return ax.node.text(node);
  if (ax.is.tag(node)) return ax.node.tag(node);
  if (ax.is.function(node)) return ax.node.function(node);
  return ax.node.json(node);
};
