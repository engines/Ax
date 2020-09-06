/**
 * Tag Builder proxy shim.
 * Creates arbitrary HTML elements.
 */
ax.tag.proxy.shim = {
  get: (target, property) => (component, attributes) => {
    if (property == '!') {
      return ax.node.raw(component);
    }
    return ax.node.create({
      ...ax.tag.proxy.attributes(property, attributes || {}),
      ...ax.tag.proxy.component(component),
    });
  },
};
