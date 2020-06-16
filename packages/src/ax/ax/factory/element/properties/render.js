/**
 * Add appropriate render function to element.
 */
ax.factory.element.properties.render = function (element) {
  let render = this.render;

  element.$render = function () {
    if (element.$ax.hasOwnProperty('$text')) {
      return render.text(element);
    } else if (element.$ax.hasOwnProperty('$html')) {
      return render.html(element);
    } else if (element.$ax.hasOwnProperty('$nodes')) {
      return render.nodes(element);
    } else {
      return element;
    }
  };

  return element;
};
