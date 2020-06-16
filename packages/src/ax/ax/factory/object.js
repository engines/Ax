/**
 * Create element for an object.
 */
ax.factory.object = function (object) {
  return this.element({
    $tag: 'pre',
    $text: JSON.stringify(object, null, 2),
  });
};
