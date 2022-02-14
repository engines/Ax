/**
 * Render html content.
 */
ax.node.create.accessors.html.set = function (element, html) {
  delete element.$ax.$text;
  delete element.$ax.$nodes;
  element.$ax.$html = html;
  ax.node.create.render.empty(element);
  ax.node.create.render.html(element);
};
