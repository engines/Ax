ax.extension.form.field.dependent.components.dependent.dependency = (
  el,
  options
) => {
  let selector;

  if (options.selector) {
    selector = options.selector;
  } else {
    selector = `[name="${options.name}"]`;
  }

  let search = options.search || '^form';
  let target = el.$(search).$(selector);
  if (target) {
    return target;
  } else {
    console.error(
      el,
      'Form field failed to find a dependency target using selector:',
      selector,
      'from options',
      options
    );
  }
};
