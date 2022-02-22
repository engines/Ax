/**
 * Add child nodes to element.
 */
ax.node.create.render.nodes = function (element) {
  // Get content for the element.
  let nodes = element.$ax.$nodes;

  // Call function, if required.
  if (ax.is.function(nodes)) nodes = nodes(element);

  // Add content.
  let target = element.shadowRoot || element;
  this.nodes.append(target, nodes);
};
