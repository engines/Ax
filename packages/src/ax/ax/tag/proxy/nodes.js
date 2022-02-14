/**
 * Set Ax content property based on component type.
 */
ax.tag.proxy.nodes = function (nodes) {
  if (ax.is.object(nodes)) {
    return nodes;
  } else if (ax.is.tag(nodes)) {
    return { $nodes: [nodes()] }
  } else if (ax.is.function(nodes)) {
    return { $nodes: [nodes] }
  } else if (ax.is.array(nodes) || ax.is.nodelist(nodes)) {
    return { $nodes: nodes };
  } else {
    return { $nodes: [nodes] };
  }
};
