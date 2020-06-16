/**
 * Define data attribute on element, with data
 * being a string or an object.
 */
ax.factory.element.properties.define.data = function (element, data) {
  if (ax.is.object(data)) {
    this.data.attribute(element, ['data'], data);
  } else {
    this.attribute(element, 'data', value);
  }
};
