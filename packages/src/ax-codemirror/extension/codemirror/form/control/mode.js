ax.extension.codemirror.form.control.mode = function (f, name, options = {}) {
  let a = ax.a;

  let mode;
  let component;
  let value;

  let selectName;

  if (name.endsWith(']')) {
    selectName = name.replace(/(.*)(\])$/, '$1_mode$2');
  } else {
    selectName = name + '_mode';
  }

  if (ax.is.string(options)) {
    component = a.label(options);
    value = () => options;
  } else if (options) {
    let selections = options.selections;

    if (ax.is.undefined(selections)) {
      selections = Object.keys(CodeMirror.modes); // List of installed language modes
      selections.shift(); // remove null
    }

    if (ax.is.object(selections) && Object.entries(selections).length > 0) {
      component = f.select({
        name: selectName,
        placeholder: '𝍣 Mode',
        selections: selections,
        value: options.value,
        selectTag: {
          $on: {
            'change: set CodeMirror mode': function () {
              this.$('^|appkit-form-codemirror').$setMode();
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
      value = () => '';
    }
  } else {
    component = null;
    value = () => '';
  }

  return a['|appkit-form-codemirror-mode'](
    component,
    {
      $value: value,
    },
    options.modeTag
  );
};
