ax.node.create.events.adds = function (element, adds) {
  if (!element.$events) element.$events = {};

  for (let add in adds) {
    element.$events[add] = adds[add];
    for (let event of add.split(':')[0].split(',')) {
      element.addEventListener(
        event.trim(),
        element.$events[add].bind(element),
        false
      );
    }
  }
};
