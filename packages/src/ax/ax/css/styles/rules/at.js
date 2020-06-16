/**
 * Handle @ rules.
 */
ax.css.styles.rules.at = function (styleSpec, selectors) {
  let atRule = selectors.shift();
  let rules = this.rules(styleSpec, selectors);
  rules = '\t' + rules.split('\n').join('\n\t');
  return `${atRule} {\n${rules}\n}\n\n`;
};
