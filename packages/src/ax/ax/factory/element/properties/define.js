/**
 * Set properties on element.
 */
ax.factory.element.properties.define = function (element) {
  for (let property in element.$ax) {
    if (element.$ax.hasOwnProperty(property)) {
      if (property[0].match(/[a-zA-Z]/)) {
        let value = element.$ax[property];

        if (ax.is.not.undefined(value)) {
          if (property == 'data') {
            this.define.data(element, value);
          } else if (property == 'style') {
            this.define.style(element, value);
          } else {
            this.define.attribute(element, property, value);
          }
        }
      } else if (property == '$pseudotag') {
        element.dataset.axPseudotag = element.$ax.$pseudotag;
      } else {
        if (
          !element.$ax.active ||
          !property.match(
            /^(\$text|\$nodes|\$html|\$state|\$send|\$on|\$off|\$render|\$ax|$events|\$|\$\$)$/
          )
        ) {
          let customAttribute = element.$ax[property];
          if (ax.is.function(customAttribute)) {
            element[property] = customAttribute.bind(element);
          } else {
            element[property] = customAttribute;
          }
        }
      }
    }
  }

  return element;
};
