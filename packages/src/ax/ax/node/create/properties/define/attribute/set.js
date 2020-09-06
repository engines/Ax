/**
 * Make a data attribute from a string or object.
 */
ax.node.create.properties.define.attribute.set = function (
  element,
  keys,
  value
) {
  const define = ax.node.create.properties.define;
  if (value && ax.is.object(value)) {
    for (let key of Object.keys(value)) {
      let kebab = ax.kebab(key);
      define.attribute.set(element, keys.concat(key), value[key]);
    }
  } else {
    let kebab = keys.join('-');
    element.setAttribute(kebab, value);
  }
};
