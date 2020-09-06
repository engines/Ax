/**
 * Determines whether value is an object.
 */
ax.is.object = function (value) {
  // return typeof value === 'object';
  return value && value.constructor === Object;
};
