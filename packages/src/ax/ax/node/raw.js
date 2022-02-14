/**
 * Creates NodeList from raw HTML.
 */
ax.node.raw = function (html) {
  let jig = window.document.createElement('div');
  jig.innerHTML = html.join('');
  return jig.childNodes;
};
