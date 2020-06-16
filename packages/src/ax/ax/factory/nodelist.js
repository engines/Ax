/**
 * Create element for a nodelist.
 */
ax.factory.nodelist = function (nodelist) {
  return this.element({
    $nodes: Array.from(nodelist),
  });
};
