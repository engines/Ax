/**
 * Render nodes content.
 */
ax.node.create.accessors.nodes.set = function (element, nodes) {
  delete element.$ax.$text;
  delete element.$ax.$html;
  element.$ax.$nodes = nodes;
  ax.node.create.render.empty(element);
  ax.node.create.render.nodes(element);
};
