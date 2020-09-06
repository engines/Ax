ax.extension.report.field.dependent.components.dependent.dependency = (
  el,
  options
) => {
  let selector;

  if (options.selector) {
    selector = options.selector;
  } else {
    let name = options.name;
    selector = `[data-name='${name}']`;
  }

  let search = options.search || '^ax-appkit-report';

  let target = el.$(search).$(selector);
  let targetDependency;

  if (target) {
    targetDependency = target.$('^ax-appkit-report-field-dependent');
  }

  if (targetDependency) {
    return targetDependency;
  } else {
    console.error(
      'Report field failed to find a dependency target using selector:',
      selector,
      'from options',
      options
    );
  }
};
