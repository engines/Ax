/**
 * Instantiate the Query Tool proxy.
 */
ax.node.create.tools.query.proxy = function (collection, pending = []) {
  return new Proxy(function () {}, this.proxy.shim(collection, pending));
};
