/**
 * Render text content.
 */
ax.node.create.properties.accessors.text.set = function (element, text) {
  delete element.$ax.$html;
  delete element.$ax.$nodes;
  element.$ax.$text = text;
  ax.node.create.properties.render.empty(element);
  ax.node.create.properties.render.text(element);

  return element;
};
