/**
 * Tag Builder proxy shim.
 * Creates arbitrary HTML elements.
 */
ax.tag.proxy.shim = {
  get: (target, property) => (component = null, attributes = {}) =>
    ax.factory.element({
      ...ax.tag.proxy.shim.attributes(property, attributes),
      ...ax.tag.proxy.shim.component(component),
    }),
};
