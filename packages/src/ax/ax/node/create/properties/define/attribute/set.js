/**
 * Set attributes on an element.
 * Value can be a string or an object.
 */
ax.node.create.properties.define.attribute.set = function (
  element,
  keys,
  value
) {
  const define = ax.node.create.properties.define;
  if (ax.is.object(value)) {
    for (let key of Object.keys(value)) {
      define.attribute.set(element, keys.concat(key), value[key]);
    }
  } else {
    let kebab = keys.map((key) => ax.kebab(key)).join('-');
    element.setAttribute(kebab, value);
  }
};
