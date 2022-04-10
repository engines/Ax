/**
 * Add render function to element.
 */
ax.node.create.render = function (element) {
  element.$render = () => {
    this.render.empty(element);
    this.apply(element);
  };
};
