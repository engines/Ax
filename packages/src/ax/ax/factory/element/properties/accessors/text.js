/**
 * Get text content, or set new text content.
 */
ax.factory.element.properties.accessors.text = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$text', {
    get: function () {
      return element.$ax.$text;
    },
    set: function (text) {
      accessors.text.set(element, text);
    },
  });

  return element;
};
