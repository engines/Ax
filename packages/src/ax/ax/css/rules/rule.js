/**
 * Convert Ax Style Definition to a css style rule.
 */
ax.css.rules.rule = function (object, selectors) {
  var result = '';
  for (let property of Object.keys(object)) {
    if (ax.is.not.object(object[property])) {
      result += '\t' + ax.kebab(property) + ': ' + object[property] + ';\n';
    }
  }
  if (result === '') return '';
  return selectors.join(' ').replace(/\s*&\s*/g, '') + ' {\n' + result + '}\n';
};
