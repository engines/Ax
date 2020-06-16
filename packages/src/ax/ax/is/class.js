/**
 * Determines whether value is a class.
 */
ax.is.class = function (value) {
  return this.function(value) && ('' + value).slice(0, 5) === 'class';
};
