/**
* Set properties on element.
*/
ax.node.create.properties = function (element) {
  for (let property in element.$ax) {
    if (element.$ax.hasOwnProperty(property)) {
      if (property[0] == '$') {
        if (!property.match(this.reserved)) {
          if (property[1] == '$') {
            this.properties.state(element, property, { reactive: true });
          } else {
            this.properties.state(element, property);
          }
        }
      } else {
        this.properties.attribute(element, property);
      }
    };
  };
}
