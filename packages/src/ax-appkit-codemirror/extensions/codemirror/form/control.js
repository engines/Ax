ax.extensions.codemirror.form.control = function (r, options = {}) {
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
      $value: (el) => () => {
        return el.$('textarea').$codemirror.getValue();
      },

      $focus: (el) => () => {
        let codemirror = el.$('textarea').$codemirror;
        if (codemirror) codemirror.focus();
      },

      $enabled: !options.disabled,
      $disable: (el) => () => {
        el.$enabled = false;
        el.$$('.CodeMirror').classList.add('disabled');
        el.$$('textarea').setAttribute('disabled', 'disabled');
      },

      $enable: (el) => () => {
        if (!options.disabled) {
          el.$enabled = true;
          el.$$('.CodeMirror').classList.remove('disabled');
          el.$$('textarea').removeAttribute('disabled');
        }
      },

      ...options.controlTag,
    }
  );
};
