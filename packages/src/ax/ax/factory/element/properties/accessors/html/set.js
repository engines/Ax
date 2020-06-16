/**
 * Render html content.
 */
ax.factory.element.properties.accessors.html.set = function (element, html) {
  delete element.$ax.$text;
  delete element.$ax.$nodes;
  element.$ax.$html = html;
  element.$render();

  return element;
};
