/**
 * Add text to element.
 */
ax.node.create.render.text = function (element) {
  // Get content for the element.
  let text = element.$ax.$text;

  // Call function, if required.
  if (ax.is.function(text)) {
    debugger
    text = text(element);
  }
  if (ax.is.array(text)) text = text.flat(Infinity).join('');

  // Add content.
  let target = element.shadowRoot || element;
  target.appendChild(window.document.createTextNode(text));
};
