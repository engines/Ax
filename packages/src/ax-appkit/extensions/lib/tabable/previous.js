ax.extensions.lib.tabable.previous = function (element) {
  let elements = Array.from(window.document.querySelectorAll('*'));

  let index = elements.indexOf(element);
  let count = elements.length;
  let target;
  let tabable;

  let i = index;
  do {
    i--;
    if (i === 0) i = count - 1;
    if (i === index) return element;
    target = elements[i];
    tabable = this(target);
  } while (!tabable);

  return target;
};
