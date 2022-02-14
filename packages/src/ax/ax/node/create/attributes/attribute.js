/**
 * Define attribute on element.
 */
ax.node.create.attributes.attribute = function (element, property) {
  let value = element.$ax[property];
  if (ax.is.not.undefined(value)) {
    if (property == 'style') {
      element.setAttribute('style', ax.style(value));
    } else {
      this.attribute.set(element, [property], value);
    }
  }
};
