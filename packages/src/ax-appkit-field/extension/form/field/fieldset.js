ax.extension.form.field.fieldset = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let control = a['ax-appkit-form-control'](
    [
      options.legend ? a.legend(options.legend, options.legendTag) : null,
      options.body || null,
    ],
    {
      $controls: (el) => () => {
        return x.lib.unnested(el, 'ax-appkit-form-control');
      },
      $buttons: (el) => () => {
        return el.$$('button').$$;
      },
      $disable: (el) => () => {
        let controls = [...el.$controls(), ...el.$buttons()];
        for (let i in controls) {
          controls[i].$disable && controls[i].$disable();
        }
      },
      $enable: (el) => () => {
        let controls = [...el.$controls(), ...el.$buttons()];
        for (let i in controls) {
          controls[i].$enable && controls[i].$enable();
        }
      },
      $focus: (el) => () => {
        let first = el.$controls()[0];
        if (first) first.$focus();
      },
    }
  );

  options.label = options.label ? options.label : false;

  return a['ax-appkit-form-field'](
    a.fieldset(
      [
        this.header(f, options),
        a['ax-appkit-form-field-body'](
          [f.help(options), control, f.hint(options)],
          options.bodyTag
        ),
      ],
      options.fieldsetTag
    )
  );
};
