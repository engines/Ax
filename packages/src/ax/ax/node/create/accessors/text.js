/**
 * Get text content, or set new text content.
 */
ax.node.create.accessors.text = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$text', {
    get: function () {
      return element.textContent;
    },
    set: function (text) {
      accessors.text.set(element, text);
    },
  });
};
