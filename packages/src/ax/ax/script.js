/**
 * Creates a <script> tag in <head>.
 */
ax.script = function (attributes = {}) {
  ax.insert(
    ax.node.create({
      $tag: 'script',
      ...attributes,
    }),
    {
      target: 'head',
    }
  );
};
