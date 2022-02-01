/**
 * Add raw HTML to element.
 */
ax.node.create.properties.render.html = function (element) {
  // Get content for the element.
  let html = element.$ax.$html;

  if (ax.is.function(html)) {
    html = html(element);
  }

  let root = element.shadowRoot || element;

  root.innerHTML = html;

  return element;
};
