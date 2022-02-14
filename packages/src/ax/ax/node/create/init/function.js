/**
 * init script.
 */
ax.node.create.init.function = function() {
  let script = window.document.currentScript;
  let element = script.parentElement;
  script.remove();
  element.$ax.$init(element);
}
