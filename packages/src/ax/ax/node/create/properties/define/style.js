/**
 * Define style attribute on element, with style
 * being a string or an object.
 */
ax.node.create.properties.define.style = function (element, style) {
  if (ax.is.object(style)) {
    let result = '';
    for (let key of Object.keys(style)) {
      let kebab = ax.kebab(key);
      result += kebab + ': ' + style[key] + '; ';
    }
    element.setAttribute('style', result);
  } else {
    element.setAttribute('style', style);
  }
};
