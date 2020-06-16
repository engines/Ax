ax.extension.codemirror.form.control.editor = function (f, options = {}) {
  let a = ax.a;

  return a['|appkit-form-codemirror-editor'](
    f.textarea({
      name: options.name,
      value: options.value,
      textareaTag: {
        $init: function () {
          this.$setup();
        },
        $refresh: function () {
          setTimeout(
            function () {
              this.$codemirror.refresh();
            }.bind(this),
            1
          );
        },
        $setup: function () {
          this.$codemirror = CodeMirror.fromTextArea(this, {
            lineNumbers: true,
            placeholder: options.placeholder,
          });

          this.$('^|appkit-form-codemirror').$setMode();
          this.$('^|appkit-form-codemirror').$setKeymap();

          this.$codemirror.setSize('100%', '100%');

          this.$required();
          this.$refresh();

          this.$codemirror.on('keyup', function (codemirror, e) {
            codemirror.getTextArea().$required();
          });
        },
        $required: function () {
          let value = this.$codemirror.getValue();
          let textarea = this.$('^|appkit-form-codemirror').$$('textarea')[1];
          if (!value && options.required) {
            textarea.setAttribute('required', true);
          } else {
            textarea.removeAttribute('required');
          }
        },
        ...options.textareaTag,
      },
    }),
    {
      $on: {
        'keyup: send control change event': (e, el) =>
          el.$send('ax.appkit.form.control.change'),
        'keyup: update textarea value': function (e) {
          this.$('textarea').$codemirror.save();
        },
        'keydown: check for editor exit': function (e) {
          let container = this.$('^|appkit-form-codemirror');
          let allowEsc = this.$('textarea').$codemirror.options.keyMap != 'vim';

          if (container.classList.contains('fullscreen')) {
            if (e.keyCode == 27 && (allowEsc || e.ctrlKey)) {
              // ESC pressed - close full screen
              container.$('|appkit-form-codemirror-fullscreen button').click();
            }
          } else {
            if (e.keyCode == 27 && e.shiftKey) {
              // shift+ESC pressed - move focus backward
              ax.x.lib.tabable.previous(e.target).focus();
            } else if (e.keyCode == 27 && (allowEsc || e.ctrlKey)) {
              // ESC pressed - move focus forward
              ax.x.lib.tabable.next(e.target).focus();
            }
          }
        },
      },
    }
  );
};
