ax.extension.codemirror.form.control.keymap = function (f, options) {
  let a = ax.a;
  let x = ax.x;

  let keymap;
  let component;
  let value;

  let keymapLabel = function (keymap) {
    let labels = {
      vim: 'Vim',
      emacs: 'Emacs',
      sublime: 'Sublime',
    };
    return labels[keymap] || keymap;
  };

  if (ax.is.string(options)) {
    component = a.label(keymapLabel(options));
    value = () => options;
  } else if (options) {
    if (ax.is.not.object(options)) {
      options = {};
    }

    let show;
    let selections = options.selections;

    if (ax.is.undefined(selections)) {
      selections = [['default', '𝍣 Keys']];

      if (CodeMirror.keyMap.vim) {
        show = true;
        selections.push(['vim', 'Vim']);
      }
      if (CodeMirror.keyMap.emacs) {
        show = true;
        selections.push(['emacs', 'Emacs']);
      }
      if (CodeMirror.keyMap.pcSublime) {
        show = true;
        selections.push(['sublime', 'Sublime']);
      }
    } else {
      show = true;
    }

    if (ax.is.true(show)) {
      component = f.select({
        selections: selections,
        value: options.value,
        selectTag: {
          $on: {
            'change: set CodeMirror keymap': function () {
              this.$('^|appkit-form-codemirror').$setKeymap();
            },
          },
          ...options.selectTag,
        },
      });
      value = function () {
        return this.$('select').value;
      };
    } else {
      component = null;
      value = () => 'default';
    }
  } else {
    component = null;
    value = () => 'default';
  }

  return a['|appkit-form-codemirror-keymap'](
    component,
    {
      $value: value,
    },
    options.keymapTag
  );
};
