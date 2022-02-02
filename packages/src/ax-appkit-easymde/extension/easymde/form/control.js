ax.extension.easymde.form.control = function (f, options) {
  let a = ax.a,
    x = ax.x;

  let controlTagOptions = {
    $value: (el) => () => {
      return el.$('textarea').value;
    },

    $enabled: true,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$$('.CodeMirror').classList.add('disabled');
      el.$$('textarea').setAttribute('disabled', 'disabled');
    },
    $enable: (el) => () => {
      el.$enabled = true;
      // el.$('ax-appkit-control-easymde').$refresh();
      el.$$('.CodeMirror').classList.remove('disabled');
      el.$$('textarea').removeAttribute('disabled');
    },
    $focus: (el) => () => {
      el.$('ax-appkit-control-easymde textarea').$easymde.codemirror.focus();
    },

    ...options.controlTag,

    $on: {
      'keyup: update textarea': (el) => (e) => {
        el.$('textarea').$updateValue();
        el.$send('ax.appkit.form.control.change');
      },
      'keydown: check for editor exit': (el) => (e) => {
        if (e.target.nodeName === 'TEXTAREA') {
          if (e.keyCode == 27) {
            // ESC pressed - move focus forward
            ax.x.lib.tabable.next(e.target).focus();
          }
        }
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-control-easymde'](
      x.easymde({
        ...options,
        textareaTag: {
          name: options.name,
          ...options.textareaTag,
        },
      })
    ),
    controlTagOptions
  );
};
