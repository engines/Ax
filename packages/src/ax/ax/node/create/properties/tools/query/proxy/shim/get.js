/**
 * Get values from selected elements.
 */
ax.node.create.properties.tools.query.proxy.shim.get = function (
  collection,
  pending
) {
  return function (target, property, receiver) {
    if (/^\d+$/.test(property)) return collection[property];
    if (/^\$\$$/.test(property)) return collection;
    if (/^toArray$/.test(property)) return collection;
    if (/^forEach$/.test(property)) return (fn) => collection.forEach(fn);
    if (/^toString$/.test(property)) return () => collection.toString();

    collection.forEach(function (node, i) {
      let result = node[property];
      if (ax.is.undefined(result)) {
        console.error(`Ax query for '${property}' is undefined on:`, node);
      } else if (ax.is.function(result)) {
        pending[i] = result;
      } else {
        collection[i] = result;
      }
    });

    return ax.node.create.properties.tools.query.proxy(collection, pending);
  };
};
