/**
 * Create element for a function.
 * Function is called with the Ax Tag Builder and Extensions.
 * The result, which can be any valid component, is fed back
 * into the Factory.
 */
ax.node.function = function (fn) {
  return ax.node.create({
    $tag: 'code',
    style: 'white-space: break-spaces',
    $text: `𝑓 ${fn}`,
  });
};
