/**
 * Creates a <link> tag in <head>.
 */
ax.link = function (attributes = {}) {
  ax.insert(
    ax.node.create({
      $tag: 'link',
      ...attributes,
    }),
    {
      target: 'head',
    }
  );
};
