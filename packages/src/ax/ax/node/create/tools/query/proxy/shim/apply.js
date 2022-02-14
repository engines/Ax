/**
 * Apply a function to selected elements.
 */
ax.node.create.tools.query.proxy.shim.apply = function (collection, pending) {
  return function (target, receiver, args) {
    collection.forEach(function (node, i) {
      collection[i] = pending[i].call(node, ...args);
    });

    return ax.node.create.tools.query.proxy(collection);
  };
};
