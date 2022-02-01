/**
 * Set properties on element.
 */
ax.node.create.properties.define = function (element) {
  for (let property in element.$ax) {
    if (element.$ax.hasOwnProperty(property)) {
      if (property[0].match(/[a-zA-Z]/)) {
        let value = element.$ax[property];
        if (ax.is.not.undefined(value)) {
          if (property == 'style') {
            this.define.style(element, value);
          } else {
            this.define.attribute(element, property, value);
          }
        }
      } else if (property == '$pseudotag') {
        element.dataset.axPseudotag = element.$ax.$pseudotag;
      } else {
        if (
          !property.match(
            /^(\$tag|\$init|\$exit|\$text|\$nodes|\$html|\$send|\$on|\$off|\$render|\$ax|$events|\$catch|\$|\$\$|\$shadow)$/
          )
        ) {
          let customAttribute = element.$ax[property];
          if (ax.is.function(customAttribute)) {
            element[property] = customAttribute(element);
          } else {
            element[property] = customAttribute;
          }
        }
      }
    }
  }

  return element;
};
