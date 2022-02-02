ax.extension.codemirror.toolbar.keymap = function (options = {}) {
  let a = ax.a,
    x = ax.x;

  let keymap = options.keymap;

  let installedKeymaps = x.codemirror.CodeMirror.keyMap;
  let component;

  let keymapLabel = (keymap) => {
    let labels = {
      vim: 'Vim',
      emacs: 'Emacs',
      sublime: 'Sublime',
    };
    return labels[keymap] || keymap;
  };

  let keymapSelect = (value, selections) => {
    if (ax.is.undefined(selections)) {
      selections = [['default', '𝍣 Keys']];
      if (installedKeymaps.vim) selections.push(['vim', 'Vim']);
      if (installedKeymaps.emacs) selections.push(['emacs', 'Emacs']);
      if (installedKeymaps.sublime) selections.push(['sublime', 'Sublime']);
    }

    return a.select(
      x.form.factory.select.options({
        value: value,
        selections: selections,
      }),
      {
        $on: {
          'change: set editor keyMap': (el) => (e) => {
            el.$(
              '^ax-appkit-codemirror-control ax-appkit-codemirror textarea'
            ).$codemirror.setOption('keyMap', el.value);
          },
        },
      }
    );
  };

  if (!keymap) {
    component = null;
  } else if (ax.is.string(keymap)) {
    component = a.label(keymapLabel(keymap));
  } else if (ax.is.object(keymap)) {
    component = keymapSelect(keymap.value, keymap.selections);
  } else {
    component = keymapSelect();
  }

  return component
    ? a['ax-appkit-codemirror-keymap'](component, options.keymapTag)
    : null;
};
