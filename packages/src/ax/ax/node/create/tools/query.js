/**
 * Query Tool, for collecting and operating on groups of elements.
 */
ax.node.create.tools.query = function (selector) {
  let collection = Array.from(this.querySelectorAll(selector));

  return ax.node.create.tools.query.proxy(collection);
};
