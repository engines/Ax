/**
 * Determines whether value is a Tag Builder Proxy function.
 */
ax.is.tag = function (value) {
  return ax.is.function(value) && ('' + ax.a.function == '' + value);
};
