/**
 * Get nodes content, or set new nodes content.
 */
ax.node.create.accessors.nodes = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$nodes', {
    get: function () {
      return Array.from(element.childNodes);
    },
    set: function (nodes) {
      accessors.nodes.set(element, nodes);
    },
  });

};
