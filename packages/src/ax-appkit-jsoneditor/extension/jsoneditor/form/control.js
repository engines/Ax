ax.extension.jsoneditor.form.control = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    $init: (el) => {
      let jsoneditorOptions = {
        onEditable: (node) => {
          return el.$enabled; // Do not allow editing when disabled.
        },
        onChange: () => {
          el.$stash();
          el.$send('ax.appkit.form.control.change');
        },
        ...options.jsoneditor,
      };

      el.$editor = new x.jsoneditor.JSONEditor(el.$('div'), jsoneditorOptions);

      let value = options.value || 'null';

      if (options.parse) {
        try {
          value = JSON.parse(value);
          el.$editor.set(value);
          el.$stash();
        } catch (error) {
          el.$nodes = a['p.error'](`⚠ ${error.message}`);
        }
      } else {
        el.$editor.set(value);
        el.$stash();
      }
    },
    $stash: (el) => () => {
      el.$('input').value = el.$value();
    },
    $value: (el) => () => {
      return JSON.stringify(el.$editor.get());
    },
    $data: (el) => () => {
      return el.$value();
    },
    $focus: (el) => () => {
      el.$('.jsoneditor-tree button').focus();
    },
    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
    },
    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
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

  return a['ax-appkit-form-control'](
    [
      a['ax-appkit-form-jsoneditor'](
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
