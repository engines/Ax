/**
 * Add text to element.
 */
ax.node.create.properties.render.text = function (element) {
  // Get content for the element.
  let text = element.$ax.$text;

  // Resolve content function, if there is one.
  if (ax.is.function(text)) {
    text = text(element);
  }

  let root = element.shadowRoot || element;

  // Add new content
  root.appendChild(window.document.createTextNode(text));

  return element;
};
