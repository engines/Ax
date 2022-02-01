/**
 * Append init script to element.
 */
ax.node.create.properties.init = function (element) {
  if (ax.is.function(element.$ax.$init)) {
    element.appendChild(
      ax.node.create({
        $tag: 'script',
        type: 'text/javascript',
        $html:
          '(function(){' +
          'let script=window.document.currentScript;' +
          'let element=script.parentElement;' +
          'script.remove();' +
          'element.$ax.$init(element);' +
          '})()',
      })
    );
  }

  return element;
};
