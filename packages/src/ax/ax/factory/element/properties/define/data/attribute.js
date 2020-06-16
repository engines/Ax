/**
 * Make a data attribute from a string or object.
 */
ax.factory.element.properties.define.data.attribute = function (
  element,
  keys,
  value
) {
  if (ax.is.string(value)) {
    let kebab = keys.join('-');
    ax.factory.element.properties.define.attribute(element, kebab, value);
  } else {
    Object.keys(value).forEach(
      function (key) {
        let kebab = ax.kebab(key);
        this.attribute(element, keys.concat(key), value[key]);
      }.bind(this)
    );
  }
};
