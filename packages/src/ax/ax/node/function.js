/**
 * Create element for a function.
 * Function is called with the Ax Tag Builder and Extensions.
 * The result, which can be any valid component, is fed back
 * into the Factory.
 */
ax.node.function = function (fn) {
  let node = fn(ax.a, ax.x)
  if (ax.is.array(node)) {
    console.error('A node may not be an array.\n', fn + '\n returned\n', node)
    return ax.node.json(node)
  }
  return ax.node(node);
};
