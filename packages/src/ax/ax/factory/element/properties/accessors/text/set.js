/**
 * Render text content.
 */
ax.factory.element.properties.accessors.text.set = function (element, text) {
  delete element.$ax.$html;
  delete element.$ax.$nodes;
  element.$ax.$text = text;
  element.$render();

  return element;
};
