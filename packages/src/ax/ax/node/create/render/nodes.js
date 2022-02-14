/**
 * Add child nodes to element.
 */
ax.node.create.render.nodes = function (element) {
  // Get content for the element.
  let nodes = element.$ax.$nodes;

  // Call function, if required.
  if (ax.is.function(nodes)) nodes = nodes(element);
  if (ax.is.not.array(nodes) && ax.is.not.nodelist(nodes)) nodes = [nodes];

  // Add content.
  let target = element.shadowRoot || element;
  this.nodes.append(target, nodes);
};
