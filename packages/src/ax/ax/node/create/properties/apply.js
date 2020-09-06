/**
 * Apply content to element.
 */
ax.node.create.properties.apply = function (element) {
  if (element.$ax.hasOwnProperty('$text')) {
    return this.render.text(element);
  } else if (element.$ax.hasOwnProperty('$nodes')) {
    return this.render.nodes(element);
  } else if (element.$ax.hasOwnProperty('$html')) {
    return this.render.html(element);
  } else {
    return element;
  }
};
