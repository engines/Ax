/**
 * Get nodes content, or set new nodes content.
 */
ax.factory.element.properties.accessors.nodes = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$nodes', {
    get: function () {
      return element.$ax.$nodes;
    },
    set: function (nodes) {
      accessors.nodes.set(element, nodes);
    },
  });

  return element;
};
