/**
 * Render text content.
 */
ax.node.create.accessors.text.set = function (element, text) {
  delete element.$ax.$html;
  delete element.$ax.$nodes;
  element.$ax.$text = text;
  ax.node.create.render.empty(element);
  ax.node.create.render.text(element);
};
