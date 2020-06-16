ax.extension.codemirror.form.control.toolbar = function (f, options = {}) {
  let a = ax.a;

  return a['|appkit-form-codemirror-toolbar'](
    [
      a['|appkit-form-codemirror-toolbar-left']([
        this.mode(f, options.name || '', options.mode || false),
      ]),
      a['|appkit-form-codemirror-toolbar-right']([
        this.keymap(f, options.keymap || false),
        a['|appkit-form-codemirror-fullscreen'](
          a.button('🗖', {
            type: 'button',
            $on: {
              'click: toggle full screen': function () {
                let container = this.$('^|appkit-form-codemirror');
                let editor = container.$('|appkit-form-codemirror-editor');
                let codemirror = editor.$('textarea').$codemirror;
                if (container.classList.contains('fullscreen')) {
                  this.$text = '🗖';
                  container.classList.remove('fullscreen');
                  editor.style.height = '';
                  codemirror.focus();
                } else {
                  this.$text = '🗗';
                  container.classList.add('fullscreen');
                  codemirror.focus();
                }
              },
            },
          })
        ),
      ]),
    ],
    options.toolbarTag
  );
};
