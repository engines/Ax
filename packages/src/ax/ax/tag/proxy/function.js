/**
 * Tag Builder proxy function.
 * Accepts an HTML fragment or an object of Ax component properties.
 * Returns an element.
 */
ax.tag.proxy.function = (arg) =>
  ax.is.object(arg) ? ax.node.create(arg) : ax.node.raw(arg);
