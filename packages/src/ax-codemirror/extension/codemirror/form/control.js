ax.extension.codemirror.form.control = function (f, options = {}) {
  let a = ax.a;

  return a['|appkit-form-control'](
    a['|appkit-form-codemirror'](
      [this.control.toolbar(f, options), this.control.editor(f, options)],
      {
        $setMode: function () {
          this.$('textarea').$codemirror.setOption(
            'mode',
            this.$('|appkit-form-codemirror-mode').$value()
          );
        },
        $setKeymap: function () {
          this.$('textarea').$codemirror.setOption(
            'keyMap',
            this.$('|appkit-form-codemirror-keymap').$value() || null
          );
        },
      }
    ),
    {
      $value: function () {
        return this.$('textarea').$codemirror.getValue();
      },
      $focus: function () {
        this.$('textarea').$codemirror.focus();
      },
      $disable: function () {
        this.$$('textarea').setAttribute('disabled', 'disabled');
      },
      $enable: function () {
        this.$('textarea').$refresh();
        if (!options.disabled) {
          this.$$('textarea').removeAttribute('disabled');
        }
      },

      ...options.controlTag,
    }
  );
};
