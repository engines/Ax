ax.extension.lib.tabable.next = function (element) {
  let elements = Array.from(window.document.querySelectorAll('*'));

  // start search at last child node
  element = Array.from(element.querySelectorAll('*')).slice(-1)[0] || element;

  let index = elements.indexOf(element);
  let count = elements.length;
  let target;
  let tabable;

  let i = index;
  do {
    i++;
    if (i === count) i = 0;
    if (i === index) return element;
    target = elements[i];
    tabable = this(target);
  } while (!tabable);

  return target;
};
