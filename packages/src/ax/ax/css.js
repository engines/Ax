/**
 * Creates a <style> tag in <head> and inserts css.
 * css can be a string or an object.
 */
ax.css = function (...sheets) {
  ax.insert(
    ax.node.create({
      $tag: 'style',
      $html: this.css.sheet(sheets),
    }),
    {
      target: 'head',
    }
  );
};
