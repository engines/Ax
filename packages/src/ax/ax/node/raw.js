/**
 * Creates elements from raw HTML.
 */
ax.node.raw = function (html) {
  let jig = window.document.createElement('div');
  jig.innerHTML = html;
  return jig.childNodes;
};
