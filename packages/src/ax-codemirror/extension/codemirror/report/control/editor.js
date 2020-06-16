ax.extension.codemirror.report.control.editor = function (options = {}) {
  let a = ax.a;

  return a['|appkit-report-codemirror-editor'](
    a.textarea(options.value, {
      $init: function () {
        this.$codemirror = CodeMirror.fromTextArea(this, {
          lineNumbers: true,
          readOnly: true,
          placeholder: options.placeholder,
          mode: options.mode || '',
        });
        this.$codemirror.setSize('100%', '100%');
        setTimeout(
          function () {
            this.$codemirror.refresh();
          }.bind(this),
          1
        );
      },
    }),
    {
      $on: {
        'keydown: check for editor exit': function (e) {
          let container = this.$('^|appkit-report-codemirror');

          if (container.classList.contains('fullscreen')) {
            if (e.keyCode == 27) {
              // ESC pressed - close full screen
              container
                .$('|appkit-report-codemirror-fullscreen button')
                .click();
            }
          } else {
            if (e.keyCode == 9 && e.shiftKey) {
              // shift+TAB pressed - move focus backward
              ax.x.lib.tabable.previous(e.target).focus();
            } else if (e.keyCode == 9) {
              // TAB pressed - move focus forward
              ax.x.lib.tabable.next(e.target).focus();
            }
          }
        },
      },
    }
  );
};
