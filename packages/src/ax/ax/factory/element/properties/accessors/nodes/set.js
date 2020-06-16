/**
 * Render nodes content.
 */
ax.factory.element.properties.accessors.nodes.set = function (element, nodes) {
  delete element.$ax.$text;
  delete element.$ax.$html;
  element.$ax.$nodes = nodes;
  element.$render();

  return element;
};
