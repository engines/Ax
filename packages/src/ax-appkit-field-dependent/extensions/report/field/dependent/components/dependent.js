ax.extensions.report.field.dependent.components.dependent = function (options) {
  let optionsCollection = x.form.field.dependent.components.dependent.collect(
    options
  );

  let dependentTag = {
    $init: (el) => {
      el.$dependencies = optionsCollection.map((options) => ({
        field: x.report.field.dependent.components.dependent.dependency(
          el,
          options
        ),
        value: options.value,
        pattern: options.pattern,
      }));
      el.$check();
    },
    $hide: (el) => () => {
      el.style.display = 'none';
    },
    $show: (el) => () => {
      el.style.display = 'block';
    },
    $value: (el) => () => {
      return el.$('ax-appkit-report-control').$value();
    },
    $match: (el) => () => {
      if (ax.is.undefined(el.$matched)) {
        if (el.$dependencies.length) {
          for (let dependency of el.$dependencies) {
            if (x.form.field.dependent.components.dependent.match(dependency)) {
              el.$matched = true;
              return true;
            }
          }
          el.$matched = false;
          return false;
        } else {
          el.$matched = true;
          return true;
        }
      } else {
        return el.$matched;
      }
    },
    $check: (el) => () => {
      if (el.$match()) {
        el.$show();
      } else {
        el.$hide();
      }
    },
    ...options.dependentTag,
    style: {
      display: 'none',
      ...(options.dependentTag || {}).style,
    },
  };

  return a['ax-appkit-report-field-dependent'](options.body, dependentTag);
};
