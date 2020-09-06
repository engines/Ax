/**
 * Convert Ax Style Definitions to css style rules.
 */
ax.css.rules = function (styles, selectors = []) {
  if (selectors[0] && selectors[0][0] == '@') {
    return ax.css.rules.at(styles, selectors);
  } else if (ax.is.object(styles)) {
    return ax.css.rules.object(styles, selectors);
  } else {
    return '';
  }
};
