ax.extension.router.interface.mount.transition = (transition, options = {}) => {
  if (ax.is.string(transition)) {
    return ax.x.transition[transition](options);
  } else if (ax.is.array(transition)) {
    let name = transition[0];
    let mergedOptions = { ...transition[1], ...options };
    return ax.x.transition[name](mergedOptions);
  } else if (ax.is.function(transition)) {
    return transition(options);
  } else {
    return transition;
  }
};
