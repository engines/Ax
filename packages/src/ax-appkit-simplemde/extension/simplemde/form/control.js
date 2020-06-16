ax.extension.simplemde.form.control = function (f, options) {
  let a = ax.a;

  let toolbarIcons = [
    {
      name: 'bold',
      action: SimpleMDE.toggleBold,
      className: 'fa fa-bold',
      title: 'Bold',
    },
    {
      name: 'italic',
      action: SimpleMDE.toggleItalic,
      className: 'fa fa-italic',
      title: 'Italic',
    },
    {
      name: 'heading',
      action: SimpleMDE.toggleHeadingSmaller,
      className: 'fa fa-heading',
      title: 'Heading',
    },
    '|',
    {
      name: 'quote',
      action: SimpleMDE.toggleBlockquote,
      className: 'fa fa-quote-left',
      title: 'Quote',
    },
    {
      name: 'unordered-list',
      action: SimpleMDE.toggleUnorderedList,
      className: 'fa fa-list-ul',
      title: 'Generic List',
    },
    {
      name: 'ordered-list',
      action: SimpleMDE.toggleOrderedList,
      className: 'fa fa-list-ol',
      title: 'Numbered List',
    },
    '|',
    {
      name: 'link',
      action: SimpleMDE.drawLink,
      className: 'fa fa-link',
      title: 'Create Link',
    },
    {
      name: 'image',
      action: SimpleMDE.drawImage,
      className: 'fa fa-image',
      title: 'Insert Image',
    },
    {
      name: 'table',
      action: SimpleMDE.drawTable,
      className: 'fa fa-table',
      title: 'Insert Table',
    },
    '|',
    {
      name: 'preview',
      action: SimpleMDE.togglePreview,
      className: 'fa fa-eye no-disable',
      title: 'Toggle Preview',
    },
    {
      name: 'side-by-side',
      action: SimpleMDE.toggleSideBySide,
      className: 'fa fa-columns no-disable',
      title: 'Toggle Side by Side',
    },
    {
      name: 'fullscreen',
      action: SimpleMDE.toggleFullScreen,
      className: 'fa fa-arrows-alt no-disable',
      title: 'Toggle Fullscreen',
    },
  ];

  let simplemdeTagOptions = {
    $init: function () {
      this.$setup();
    },

    $setup: function () {
      this.$simplemde = new SimpleMDE({
        element: this.$('textarea'),
        toolbar: toolbarIcons,
        placeholder: options.placeholder,
        autoDownloadFontAwesome: false,
        spellChecker: false,
        renderingConfig: {
          markedOptions: {
            sanitize: true,
          },
        },
        ...options.simplemde,
      });

      // Set required attribute on the CodeMirror textarea
      let checkRequired = (value) => {
        let textarea = this.$('.CodeMirror textarea');
        if (options.required && !value) {
          textarea.required = options.required;
        } else {
          textarea.removeAttribute('required');
        }
      };

      checkRequired(options.value);

      this.$refresh();

      this.$simplemde.codemirror.on('change', (e) => {
        checkRequired(this.$simplemde.value());
      });
    },
    $refresh: function () {
      setTimeout(
        function () {
          this.$simplemde.codemirror.refresh();
        }.bind(this),
        1
      );
    },

    $on: {
      'keyup: update textarea': (e, el) => {
        el.$('textarea').value = el.$simplemde.value();
        el.$send('ax.appkit.form.control.change');
      },
      'keydown: check for editor exit': (e, el) => {
        if (
          el.$('div.CodeMirror').classList.contains('CodeMirror-fullscreen')
        ) {
          // SimpleMDE closes fullscreen when ESC pressed.
          el.$simplemde.codemirror.focus();
        } else {
          if (e.target.nodeName === 'TEXTAREA') {
            if (e.keyCode == 27 && e.shiftKey) {
              // shift+ESC pressed - move focus backward
              ax.x.lib.tabable.previous(e.target).focus();
            } else if (e.keyCode == 27) {
              // ESC pressed - move focus forward
              ax.x.lib.tabable.next(e.target).focus();
            }
          }
        }
      },
    },

    ...options.simplemdeTag,
  };

  let controlTagOptions = {
    $value: function () {
      return this.$$('textarea').value();
    },
    $disable: function () {
      this.$$('textarea').setAttribute('disabled', 'disabled');
    },
    $enable: function () {
      this.$('|appkit-form-simplemde').$refresh();
      this.$$('textarea').removeAttribute('disabled');
    },
    $focus: function () {
      this.$('|appkit-form-simplemde').$simplemde.codemirror.focus();
    },

    ...options.markdownTag,
  };

  return a['|appkit-form-control'](
    a['|appkit-form-simplemde'](
      f.textarea({
        value: options.value,
        name: options.name,
        ...options.textareaTag,
      }),
      simplemdeTagOptions
    ),
    controlTagOptions
  );
};
