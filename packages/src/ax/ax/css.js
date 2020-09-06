/**
 * Process style definitions.
 */
ax.css = function (...styles) {
  return styles
    .map((style) => {
      if (ax.is.string(style)) {
        return style;
      } else if (ax.is.array(style)) {
        return ax.css(style);
      } else {
        return ax.css.rules(style);
      }
    })
    .join('');
};
