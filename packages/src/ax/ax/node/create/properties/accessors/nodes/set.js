/**
 * Render nodes content.
 */
ax.node.create.properties.accessors.nodes.set = function (element, nodes) {
  delete element.$ax.$text;
  delete element.$ax.$html;
  element.$ax.$nodes = nodes;
  ax.node.create.properties.render.empty(element);
  ax.node.create.properties.render.nodes(element);

  return element;
};
