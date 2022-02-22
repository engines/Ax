/**
 * Tag Builder proxy shim.
 * Creates arbitrary HTML elements.
 */
ax.tag.proxy.shim = {
  get: (target, property) => {

    if (ax.is.not.string(property)) {
      new Error('Expecting a string but got', property);
    }

    return (...properties) => {
      if (property == '!') return ax.node.raw(properties);
      return ax.tag.proxy.create(
        ax.tag.proxy.property(property),
        ...properties
      );
    }
  },
}
