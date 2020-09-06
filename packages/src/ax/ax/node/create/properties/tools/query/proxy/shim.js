/**
 * Query Tool shim.
 */
ax.node.create.properties.tools.query.proxy.shim = function (
  collection,
  pending
) {
  return {
    get: ax.node.create.properties.tools.query.proxy.shim.get(
      collection,
      pending
    ),
    set: ax.node.create.properties.tools.query.proxy.shim.set(
      collection,
      pending
    ),
    apply: ax.node.create.properties.tools.query.proxy.shim.apply(
      collection,
      pending
    ),
  };
};
