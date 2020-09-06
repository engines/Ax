/**
 * Add appropriate render function to element.
 */
ax.node.create.properties.render = function (element) {
  element.$render = () => {
    if (element.$ax.$update) {
      element.$ax.$update(element, element.$state) &&
        this.apply(this.render.empty(element));
    } else {
      this.apply(this.render.empty(element));
    }
    return element;
  };

  return element;
};
