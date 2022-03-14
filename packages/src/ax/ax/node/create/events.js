/**
 * Add initial events to element.
 */
ax.node.create.events = function (element) {
  if (element.$ax.$on) {
    ax.node.create.events.ons(element, element.$ax.$on)
  }
};

ax.node.create.events.ons = function(element, ons) {
  if (!element.$events) element.$events = {};

  for (let on in ons) {
    element.$events[on] = ons[on];
    for (let event of on.split(':')[0].split(',')) {
      element.addEventListener(
        event.trim(),
        (event) => element.$events[on](event, element),
        false
      );
    }
  };
}
