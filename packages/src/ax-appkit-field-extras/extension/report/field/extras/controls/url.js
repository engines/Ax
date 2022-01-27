ax.extension.report.field.extras.controls.url = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    component = a.a(value, {
      href: value,
      target: value,
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
      el.$('ax-appkit-report-url').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-url'](component, {
        tabindex: 0,
        ...options.urlTag,
      }),
      r.validation({
        controlPattern: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
        controlInvalid: 'Should be a valid URL.',
        ...options,
      }),
    ],
    controlTagOptions
  );
};
