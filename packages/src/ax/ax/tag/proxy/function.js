/**
 * Tag Builder proxy function.
 * Accepts an HTML fragment or an object of Ax component properties.
 * Returns an element.
 */
ax.tag.proxy.function = function (component) {
  if (ax.is.string(component)) {
    let jig = window.document.createElement('div');
    jig.innerHTML = component;
    return jig.childNodes;
  }
  if (ax.is.object(component)) {
    return ax.factory.element(component);
  } else {
    console.error('Component must be String or Object.');
  }
};
