ax.extension.form.field.dependent.components.dependent.dependency = (
  el,
  options
) => {
  let selector;

  if (options.selector) {
    selector = options.selector;
  } else {
    let name = options.name;
    selector = `[name="${name}"]`;
  }

  let search = options.search || '^form';

  let target = el.$(search).$(selector);
  let targetDependency;

  if (target) {
    targetDependency = target.$('^|appkit-form-field-dependent');
  }

  if (targetDependency) {
    return targetDependency;
  } else {
    console.error(
      el,
      `Form field failed to find a dependency target using selector:`,
      selector
    );
  }
};
