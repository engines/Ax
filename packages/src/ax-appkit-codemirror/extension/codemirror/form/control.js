ax.extension.codemirror.form.control = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['ax-appkit-form-control'](
    a['ax-appkit-codemirror-control']([
      x.codemirror({
        ...options,
        textareaTag: {
          name: options.name,
          disabled: options.disabled,
          ...options.textareaTag,
        },
        codemirrorTag: {
          $on: {
            'keyup: update textarea value': (e, el) => {
              el.$send('ax.appkit.form.control.change');
              el.$('textarea').$codemirror.save();
            },
            'keydown: check for exit': (e, el) => {
              let control = el.$('^ax-appkit-codemirror-control');
              let allowEsc =
                el.$('textarea').$codemirror.options.keyMap != 'vim';

              if (control.classList.contains('fullscreen')) {
                if (e.keyCode == 27 && (allowEsc || e.ctrlKey)) {
                  // ESC pressed - close full screen
                  control.$('ax-appkit-codemirror-fullscreen button').click();
                }
              } else {
                if (e.keyCode == 27 && (allowEsc || e.ctrlKey)) {
                  // ESC pressed - move focus forward
                  if (e.ctrlKey && e.shiftKey) {
                    // ctrl+shift+ESC pressed - move focus backward
                    ax.x.lib.tabable.previous(e.target).focus();
                  } else {
                    ax.x.lib.tabable.next(e.target).focus();
                  }
                }
              }
            },
            ...(options.codemirrorTag || {}).$on,
          },
          ...options.codemirrorTag,
        },
      }),
    ]),
    {
      // $init: (el) => {
      //   el.$valid()
      // },

      $value: (el) => () => {
        return el.$('textarea').$codemirror.getValue();
      },

      $focus: (el) => () => {
        el.$('textarea').$codemirror.focus();
      },

      $disable: (el) => () => {
        el.$$('.CodeMirror').classList.add('disabled');
        el.$$('textarea').setAttribute('disabled', 'disabled');
      },

      $enable: (el) => () => {
        if (!options.disabled) {
          el.$$('.CodeMirror').classList.remove('disabled');
          el.$$('textarea').removeAttribute('disabled');
        }
      },

      // $validity: (el) => () => {
      //   return el.$('textarea').validity;
      // },
      //
      // $valid: (el) => () => {
      //   el.$('.CodeMirror textarea').setCustomValidity('');
      //   if (el.$validity().valid) {
      //     return true;
      //   } else {
      //     if (options.invalid) {
      //       if (ax.is.function(options.invalid)) {
      //         let invalidMessage = options.invalid(el.$value, el.$validity);
      //         if (invalidMessage) {
      //           el.$('.CodeMirror textarea').setCustomValidity(invalidMessage);
      //         }
      //       } else {
      //         el.$('.CodeMirror textarea').setCustomValidity(options.invalid);
      //       }
      //     }
      //     return false;
      //   }
      // },

      ...options.controlTag,

      // $on: {
      //   // 'input: check validity': (e, el) => {
      //   //   el.$valid();
      //   // },
      //   'input: send control change event': (e, el) => {
      //     el.$send('ax.appkit.form.control.change');
      //   },
      //   ...(options.controlTag || {}).$on,
      // },
    }
  );
};
