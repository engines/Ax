ax.extension.report.field.extras.components.controls.url = (
  r,
  options = {}
) => {
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
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [
      a['|appkit-report-timezone'](component, options.urlTag),
      r.validation({
        controlPattern: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
        controlInvalid: 'Not a valid URL',
        ...options,
      }),
    ],
    controlTagOptions
  );
};
