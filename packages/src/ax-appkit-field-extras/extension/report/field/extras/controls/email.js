ax.extension.report.field.extras.controls.email = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    component = a.a(value, {
      href: `mailto: ${value}`,
    });
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-email').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-email'](component, {
        tabindex: 0,
        ...options.emailTag,
      }),
      r.validation({
        controlPattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        controlInvalid: 'Should be an email address.',
        ...options,
      }),
    ],
    controlTagOptions
  );
};
