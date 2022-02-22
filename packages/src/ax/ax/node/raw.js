/**
 * Creates NodeList from raw HTML.
 */
ax.node.raw = function (...html) {
  let jig = window.document.createElement('div');
  jig.innerHTML = html.flat(Infinity).join('');
  // debugger
  return jig.childNodes;
};
