/**
 * Clear exisitng children from element.
 */
ax.node.create.render.empty = function (element) {
  while (element.childNodes.length) {
    let child = element.lastChild;
    ax.node.create.render.exit(child);
    child.remove();
  }
};
