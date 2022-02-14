/**
 * Create element for an object.
 */
ax.node.json = function (object) {
  return ax.node.create({
    $tag: 'pre',
    $text: JSON.stringify(object, null, 2),
  });
};
