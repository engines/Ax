/**
 * Add raw HTML to element.
 */
ax.factory.element.properties.render.html = function (element) {
  // Get content for the element.
  let html = element.$ax.$html;

  if (ax.is.function(html)) {
    html = html.call(element, element, element.$state);
  }

  element.innerHTML = html;

  return element;
};
