/**
 * Add appropriate render function to element.
 */
ax.node.create.properties.render = function (element) {
  element.$render = () => {
    this.apply(this.render.empty(element));
    // if (!!element.$ax.$update) {
    //   element.$ax.$update(element, element.$state) &&
    //     this.apply(this.render.empty(element));
    // } else {
    // }
    return element;
  };

  return element;
};
