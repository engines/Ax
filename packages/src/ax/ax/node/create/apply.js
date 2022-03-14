/**
 * Apply content to element.
 */
ax.node.create.apply = function (element) {
  if (element.$ax.hasOwnProperty('$text')) {
    this.render.text(element);
  } else if (element.$ax.hasOwnProperty('$nodes')) {
    this.render.nodes(element);
  } else if (element.$ax.hasOwnProperty('$html')) {
    this.render.html(element);
  }
};
