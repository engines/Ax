/**
 * Add raw HTML to element.
 */
ax.node.create.render.html = function (element) {
  // Get content for the element.
  let html = element.$ax.$html;

  // Call function, if required.
  if (ax.is.function(html)) {
    debugger
    html = html(element);
  }
  if (ax.is.array(html)) html = html.flat(Infinity).join('');

  // Add content.
  let target = element.shadowRoot || element;
  target.innerHTML = html;
};
