/**
 * Creates a <style> tag in <head> and inserts styles.
 * styles can be a string or an object.
 */
ax.css = function (...styles) {
  ax.insert(
    ax.node.create({
      $tag: 'style',
      $html: this.css.styles(...styles),
    }),
    {
      target: 'head',
    }
  );
};
