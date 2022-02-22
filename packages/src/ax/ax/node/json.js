/**
 * Create element for an object.
 */
ax.node.json = function (object) {
  return ax.node.create({
    $tag: 'code',
    style: 'white-space: break-spaces',
    $text: JSON.stringify(object, null, 2),
  });
};
