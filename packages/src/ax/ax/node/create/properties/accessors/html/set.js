/**
 * Render html content.
 */
ax.node.create.properties.accessors.html.set = function (element, html) {
  delete element.$ax.$text;
  delete element.$ax.$nodes;
  element.$ax.$html = html;
  ax.node.create.properties.render.empty(element);
  ax.node.create.properties.render.html(element);

  return element;
};
