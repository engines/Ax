/**
 * Append init script to element.
 */
ax.node.create.init = function (element) {
  if (ax.is.function(element.$ax.$init)) {
    element.appendChild(
      ax.node.create({
        $tag: 'script',
        type: 'text/javascript',
        $text:`(${ax.node.create.init.function})()`,
      })
    );
  };
};
