ax.extension.form.field.components.fieldset = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let control = a['|appkit-form-control'](
    [
      options.legend ? a.legend(options.legend, options.legendTag) : null,
      options.body || null,
    ],
    {
      $controls: function () {
        return x.lib.unnested(this, '|appkit-form-control');
      },
      $buttons: function () {
        return this.$$('button').$$;
      },
      $disable: function () {
        let controls = [...this.$controls(), ...this.$buttons()];
        for (let i in controls) {
          controls[i].$disable && controls[i].$disable();
        }
      },
      $enable: function () {
        let controls = [...this.$controls(), ...this.$buttons()];
        for (let i in controls) {
          controls[i].$enable && controls[i].$enable();
        }
      },
      $focus: function () {
        let first = this.$controls()[0];
        if (first) first.$focus();
      },
    }
  );

  options.label = options.label ? options.label : false;

  return a['fieldset|appkit-form-fieldset'](
    [
      this.header(f, options),
      a['|appkit-form-field-body'](
        [f.help(options), control, f.hint(options)],
        options.bodyTag
      ),
    ],
    options.fieldsetTag
  );
};
