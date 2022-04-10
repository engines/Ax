// Ax, copyright (c) Lachlan Douglas
// Distributed under an MIT license: https://github.com/engines/Ax/LICENSE.md
;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = {
      extend: (ax, dependencies={}) => factory(ax, dependencies)
    };
  } else {
    factory(root.ax)
  }
}(this, function(ax, dependencies={}) {

const a = ax.a,
  x = ax.x,
  is = ax.is;

ax.extensions.jsoneditor = {};

ax.css({
  'ax-appkit-form-codemirror': {
    '.jsoneditor-tree': {
      $: {
        background: 'white',
      },
    },
  },
});

ax.extensions.jsoneditor.JSONEditor = window.JSONEditor;

ax.extensions.jsoneditor.form = {};

ax.extensions.jsoneditor.form.control = function (f, options = {}) {
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
      'keydown: check for editor exit': (e) => {
        let el = e.currentTarget;
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
          a.input({
            name: options.name,
            type: 'hidden',
          }),
          a.div,
        ],
        options.jsoneditorTag || {}
      ),
    ],
    controlTagOptions
  );
};

}));
