/**
 * Create element for an object.
 */
ax.node.object = function (object) {
  console.log(object);
  return ax.node.create({
    $tag: 'pre',
    $text: JSON.stringify(object, null, 2),
  });
};