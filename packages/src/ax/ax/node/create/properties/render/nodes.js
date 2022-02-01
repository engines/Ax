/**
 * Add child nodes to element.
 */
ax.node.create.properties.render.nodes = function (element) {
  // Get content for the element.
  let nodes = element.$ax.$nodes;

  if (ax.is.function(nodes)) {
    nodes = nodes(element);
  }

  let root = element.shadowRoot || element;

  // Add content
  if (ax.is.array(nodes)) {
    nodes.forEach(function (node) {
      node = ax.node(node);
      if (node != null && node.tagName != '_') root.appendChild(node);
    });
  } else {
    let node = ax.node(nodes);
    if (node != null && node.tagName != '_') root.appendChild(node);
  }

  return element;
};
