ax.extension.report.field.extras.controls.password = function (r, options) {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-password').focus();
    },

    ...options.controlTag,
  };

  let passwordTagOptions = {
    $init: (el) => {
      el.style.fontFamily = 'text-security-disc';
    },
    ...options.passwordTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-password'](
        options.value
          ? [
              a['ax-appkit-report-password-text'](null, {
                $nodes: (el) => {
                  let flag = el.$showPassword;
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
                $showPassword: 1,
                ...options.textTag,
              }),
              x.button({
                label: '👁',
                onclick: (el) => (e) => {
                  let text = el.$(
                    '^ax-appkit-report-password ax-appkit-report-password-text'
                  );
                  text.$showPassword = text.$showPassword * -1;
                  el.$render();
                },
                ...options.button,
              }),
            ]
          : a['i.placeholder'](
              ax.is.undefined(options.placeholder) ? '' : options.placeholder
            ),
        {
          tabindex: 0,
          ...options.passwordTag,
        }
      ),
      r.validation(options),
    ],
    controlTagOptions
  );
};
