/**
 * Tag Builder proxy shim.
 * Creates arbitrary HTML elements.
 */
ax.tag.proxy.shim = {
  get: (target, property) => {
    return (...attributes) => {
      if (property == '!') return ax.node.raw(attributes);
      return ax.tag.proxy.create(
        ax.tag.proxy.property(property),
        ...attributes
      );
    }
  },
}
