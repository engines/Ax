/**
 * Append init script to element.
 */
ax.factory.element.init = function (element) {
  if (ax.is.function(element.$ax.$init)) {
    element.appendChild(
      ax.factory.element({
        $tag: 'script',
        type: 'text/javascript',
        $html:
          '(function(){' +
          'let script=window.document.currentScript;' +
          'let element=script.parentElement;' +
          'script.remove();' +
          'element.$init( element, element.$state );' +
          '})()',
      })
    );
  }

  return element;
};
