ax.extension.lib.tabable = function (element) {
  if (element.tabIndex >= 0 && ax.x.lib.element.visible(element)) {
    return true;
  } else {
    return false;
  }
};
