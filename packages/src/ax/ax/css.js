/**
 * Creates a <style> tag in <head> and inserts css.
 * css can be a string or an object.
 */
ax.css = function (sheet) {
  ax.insert(
    ax.node.create({
      $tag: 'style',
      $html: this.css.sheet(sheet),
    }),
    {
      target: 'head',
    }
  );
};
