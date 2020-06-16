/**
 * Convert Ax Style Definition to a css style rule.
 */
ax.css.styles.rules.rule = function (object, selectors) {
  var result = '';
  Object.keys(object).forEach(function (property) {
    if (!ax.is.object(object[property])) {
      result += '\t' + ax.kebab(property) + ': ' + object[property] + ';\n';
    }
  });

  if (result === '') {
    return result;
  } else {
    return (
      selectors.join(' ').replace(/\s*&\s*/g, '') + ' {\n' + result + '}\n'
    );
  }
};
