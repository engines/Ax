/**
 * Instantiate the Query Tool proxy.
 */
ax.factory.element.properties.tools.query.proxy = function (
  collection,
  pending = []
) {
  return new Proxy(function () {}, this.proxy.shim(collection, pending));
};
