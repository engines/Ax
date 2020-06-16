/**
 * Create element for a function.
 * Function is called with the Ax Tag Builder and Extensions.
 * The result, which can be any valid component, is fed back
 * into the Factory.
 */
ax.factory.function = function (fn) {
  return this(fn(ax.a, ax.x));
};
