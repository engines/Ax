/**
 * Add text to element.
 */
ax.factory.element.properties.render.text = function (element) {
  // Get content for the element.
  let text = element.$ax.$text;

  // Resolve content function, if there is one.
  if (ax.is.function(text)) {
    text = text.call(element, element, element.$state);
  }

  // Clear exisitng content
  while (element.childNodes.length) {
    element.removeChild(element.lastChild);
  }

  // Add new content
  element.appendChild(window.document.createTextNode(text));

  return element;
};
