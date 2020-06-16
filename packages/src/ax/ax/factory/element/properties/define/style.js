/**
 * Define style attribute on element, with style
 * being a string or an object.
 */
ax.factory.element.properties.define.style = function (element, style) {
  if (ax.is.object(style)) {
    let result = '';
    Object.keys(style).forEach(
      function (key) {
        let kebab = ax.kebab(key);
        result += kebab + ': ' + style[key] + '; ';
      }.bind(this)
    );
    this.attribute(element, 'style', result);
  } else {
    this.attribute(element, 'style', style);
  }
};
