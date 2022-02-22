/**
 * Set attributes on an element.
 * Value can be a string or an object.
 */
ax.node.create.properties.attribute.set = function (element, keys, value) {
  if (ax.is.object(value)) {
    for (let key of Object.keys(value)) {
      this.set(element, [...keys, key], value[key]);
    }
  } else {
    element.setAttribute(ax.kebab(...keys), value);
  }
};
