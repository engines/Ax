/**
 * Set properties on element.
 */
ax.node.create.attributes = function (element) {
  for (let property in element.$ax) {
    if (element.$ax.hasOwnProperty(property)) {
      if (property[0] == '$') {
        if (!property.match(this.reserved)) {
          this.attributes.state(element, property);
        }
      } else if (property[0] == '_') {
        this.attributes.state(element, property, { active: true });
      } else {
        this.attributes.attribute(element, property);
      }
    }
  };
};
