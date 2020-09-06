/**
 * Clear exisitng children from element.
 */
ax.node.create.properties.render.empty = function (element) {
  while (element.childNodes.length) {
    let child = element.lastChild;
    ax.node.create.properties.render.exit(child);
    child.remove();
  }

  return element;
};
