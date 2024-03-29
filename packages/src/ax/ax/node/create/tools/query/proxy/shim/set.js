/**
 * Set a value on selected elements.
 */
ax.node.create.tools.query.proxy.shim.set = function (collection, pending) {
  return function (target, property, value, receiver) {
    collection.forEach(function (node) {
      node[property] = value;
    });

    return true;
  };
};
