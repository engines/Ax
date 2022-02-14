/**
 * Get HTML content, or set new HTML content.
 */
ax.node.create.accessors.html = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$html', {
    get: function () {
      return element.innerHTML;
    },
    set: function (html) {
      accessors.html.set(element, html);
    },
  });
};
