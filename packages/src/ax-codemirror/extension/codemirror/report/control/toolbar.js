ax.extension.codemirror.report.control.toolbar = function (options = {}) {
  let a = ax.a;

  return a['|appkit-report-codemirror-toolbar']([
    a['|appkit-form-codemirror-toolbar-left']([
      a['|appkit-report-codemirror-mode'](a.label(options.mode)),
    ]),
    a['|appkit-report-codemirror-toolbar-right'](
      a['|appkit-report-codemirror-fullscreen'](
        a.button('🗖', {
          type: 'button',
          $on: {
            'click: toggle full screen': function () {
              let container = this.$('^|appkit-report-codemirror');
              let editor = container.$('|appkit-report-codemirror-editor');
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
      )
    ),
  ]);
};
