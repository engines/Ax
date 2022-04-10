/**
 * Creates a <script> tag in <head>.
 */
ax.script = function (...attributes) {
  ax.insert(ax.a(...attributes, { $tag: 'script' }), {
    target: 'head',
  });
};
