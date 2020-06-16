ax.extension.report.field.extras.components.controls.tel = (
  r,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    component = a.a(value, {
      href: `tel: ${value}`,
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
      a['|appkit-report-tel'](component, options.telTag),
      r.validation({
        controlPattern: /^(?:\d{8}(?:\d{2}(?:\d{2})?)?|\(\+?\d{2,3}\)\s?(?:\d{4}[\s*.-]?\d{4}|\d{3}[\s*.-]?\d{3}|\d{2}([\s*.-]?)\d{2}\1\d{2}(?:\1\d{2})?))$/,
        controlInvalid: 'Not a valid phone number',
        ...options,
      }),
    ],
    controlTagOptions
  );
};
