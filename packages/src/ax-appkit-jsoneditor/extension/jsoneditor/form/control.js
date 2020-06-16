ax.extension.jsoneditor.form.control = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    $init: function () {
      let editor = this;

      let jsoneditorOptions = {
        onEditable: function (node) {
          return !editor.$disabled; // Do not allow editing when disabled.
        },
        onChange: function () {
          editor.$stash();
          editor.$send('ax.appkit.form.control.change');
        },
        ...options.jsoneditor,
      };

      this.$editor = new JSONEditor(this.$('div'), jsoneditorOptions);

      let value = options.value || 'null';

      if (options.parse) {
        try {
          value = JSON.parse(value);
          this.$editor.set(value);
          this.$stash();
        } catch (error) {
          this.$nodes = a['p.error'](`⚠ ${error.message}`);
        }
      } else {
        this.$editor.set(value);
        this.$stash();
      }
    },
    $stash: function () {
      this.$('input').value = this.$value();
    },
    $value: function () {
      return JSON.stringify(this.$editor.get());
    },
    $data: function () {
      return this.$value();
    },
    $focus: function () {
      this.$('.jsoneditor-tree button').focus();
    },
    $disable: function () {
      this.$disabled = true;
    },
    $enable: function () {
      if (!options.disabled) {
        this.$disabled = false;
      }
    },
    $on: {
      'keydown: check for editor exit': (e, el) => {
        if (e.keyCode == 27 && e.shiftKey) {
          // shift+ESC pressed - move focus backward
          ax.x.lib.tabable.previous(el).focus();
        } else if (e.keyCode == 27 && e.ctrlKey) {
          // ctrl+ESC pressed - move focus forward
          ax.x.lib.tabable.next(el).focus();
        }
      },
    },

    ...options.controlTag,
  };

  return a['|appkit-form-control'](
    [
      a['|appkit-form-jsoneditor'](
        [
          a.input(null, {
            name: options.name,
            type: 'hidden',
          }),
          a.div,
        ],
        options.jsoneditorTag
      ),
    ],
    controlTagOptions
  );
};
