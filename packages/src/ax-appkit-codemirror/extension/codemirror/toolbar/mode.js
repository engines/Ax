ax.extension.codemirror.toolbar.mode = function (options = {}) {
  let a = ax.a,
    x = ax.x;

  let mode = options.mode;
  let component;

  if (ax.is.string(mode)) {
    component = a.label(mode);
  } else if (mode) {
    let selections = mode.selections;

    let selectName = '';
    if (options.name) {
      if (options.name.endsWith(']')) {
        selectName = options.name.replace(/(.*)(\])$/, '$1_mode]');
      } else {
        selectName = options.name + '_mode';
      }
    }

    if (ax.is.undefined(selections)) {
      selections = Object.keys(x.codemirror.CodeMirror.modes); // List of installed language modes
      selections.shift(); // remove 'null'
    }

    component = a.select(
      x.form.factory.select.options({
        placeholder: '𝍣 Mode',
        value: mode.value,
        selections: selections,
      }),
      {
        name: selectName,
        $on: {
          'change: set editor mode': (el) => (e) => {
            el.$(
              '^ax-appkit-codemirror-control ax-appkit-codemirror textarea'
            ).$codemirror.setOption('mode', el.value);
          },
        },
      }
    );
  } else {
    component = null;
  }

  return component
    ? a['ax-appkit-codemirror-mode'](component, options.modeTag)
    : null;
};
