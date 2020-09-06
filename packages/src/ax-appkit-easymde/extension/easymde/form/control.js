ax.extension.easymde.form.control = function (f, options) {
  let a = ax.a,
    x = ax.x;

  let controlTagOptions = {
    $value: (el) => () => {
      return el.$$('textarea').value();
    },
    $disable: (el) => () => {
      el.$$('.CodeMirror').classList.add('disabled');
      el.$$('textarea').setAttribute('disabled', 'disabled');
    },
    $enable: (el) => () => {
      // el.$('ax-appkit-control-easymde').$refresh();
      el.$$('.CodeMirror').classList.remove('disabled');
      el.$$('textarea').removeAttribute('disabled');
    },
    $focus: (el) => () => {
      el.$('ax-appkit-control-easymde textarea').$easymde.codemirror.focus();
    },

    ...options.controlTag,

    $on: {
      'keyup: update textarea': (e, el) => {
        el.$('textarea').$updateValue();
        el.$send('ax.appkit.form.control.change');
      },
      'keydown: check for editor exit': (e, el) => {
        // if (
        //   el.$('div.CodeMirror').classList.contains('CodeMirror-fullscreen')
        // ) {
        //   // EasyMDE closes fullscreen when ESC pressed.
        //   el.$focus();
        // } else {
        if (e.target.nodeName === 'TEXTAREA') {
          // if (e.keyCode == 27 && e.shiftKey) {
          //   // shift+ESC pressed - move focus backward
          //   ax.x.lib.tabable.previous(e.target).focus();
          // } else
          if (e.keyCode == 27) {
            // ESC pressed - move focus forward
            ax.x.lib.tabable.next(e.target).focus();
          }
        }
        // }
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
