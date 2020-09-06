/**
 * Create element for undefined content.
 */
ax.node.undefined = function () {
  let el = ax.node.text('UNDEFINED');
  console.warn('Component is undefined:', el);
  return el;
};
