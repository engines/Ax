/**
 * Query Tool, for collecting and operating on groups of elements.
 */
ax.factory.element.properties.tools.query = function (selector) {
  selector = selector.replace(/\|([\w\-]+)/g, '[data-ax-pseudotag="$1"]');

  let collection = Array.from(this.querySelectorAll(selector));

  return ax.factory.element.properties.tools.query.proxy(collection);
};
