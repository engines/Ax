/**
 * Get HTML content, or set new HTML content.
 */
ax.factory.element.properties.accessors.html = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$html', {
    get: function () {
      return element.$ax.$html;
    },
    set: function (html) {
      accessors.html.set(element, html);
    },
  });

  return element;
};
