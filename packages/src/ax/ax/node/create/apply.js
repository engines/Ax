/**
 * Apply content to element.
 */
ax.node.create.apply = function (element) {
  if (element.$ax.hasOwnProperty('$textFn')) {
    element.$ax.$text = element.$ax.$textFn(element);
  } else if (element.$ax.hasOwnProperty('$nodesFn')) {
    element.$ax.$nodes = element.$ax.$nodesFn(element);
  } else if (element.$ax.hasOwnProperty('$htmlFn')) {
    element.$ax.$html = element.$ax.$htmlFn(element);
  }
  if (element.$ax.hasOwnProperty('$text')) {
    this.render.text(element);
  } else if (element.$ax.hasOwnProperty('$nodes')) {
    this.render.nodes(element);
  } else if (element.$ax.hasOwnProperty('$html')) {
    this.render.html(element);
  }
};
