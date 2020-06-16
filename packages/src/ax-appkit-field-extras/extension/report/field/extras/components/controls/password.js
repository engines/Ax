ax.extension.report.field.extras.components.controls.password = function (
  r,
  options
) {
  let a = ax.a;
  let x = ax.x;

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

  let passwordTagOptions = {
    $init: (el) => {
      el.style.fontFamily = 'text-security-disc';
    },
    ...options.passwordTag,
  };

  return a['|appkit-report-control'](
    [
      a['|appkit-report-password'](
        options.value
          ? [
              a['|appkit-report-password-text'](null, {
                $nodes: (el, flag) => {
                  if (flag > 0) {
                    el.style.fontFamily = 'text-security-disc';
                    el.classList.add('secure-text');
                  } else {
                    el.style.fontFamily = 'monospace';
                    el.classList.remove('secure-text');
                  }
                  return a({
                    $text: options.value || '',
                  });
                },
                $state: 1,
                ...options.textTag,
              }),
              x.button({
                label: '👁',
                onclick: (e, el) => {
                  let text = el.$(
                    '^|appkit-report-password |appkit-report-password-text'
                  );
                  text.$state = text.$state * -1;
                },
                ...options.button,
              }),
            ]
          : a['i.placeholder'](
              ax.is.undefined(options.placeholder)
                ? 'None'
                : options.placeholder
            ),
        options.passwordTag
      ),
      r.validation(options),
    ],
    controlTagOptions
  );
};
