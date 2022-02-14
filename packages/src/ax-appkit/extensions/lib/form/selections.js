ax.extensions.lib.form.selections = function (selections) {
  if (ax.is.array(selections)) {
    selections = selections.map(function (selection) {
      if (ax.is.array(selection)) {
        return {
          value: selection[0],
          label: selection[1],
          disabled: selection[2],
        };
      } else if (ax.is.object(selection)) {
        return {
          value: selection.value,
          label: selection.label,
          disabled: selection.disabled,
        };
      } else {
        return {
          value: selection,
          label: selection,
        };
      }
    });
  } else {
    selections = Object.keys(selections || {}).map(function (key) {
      let label = selections[key];
      return {
        value: key,
        label: label,
      };
    });
  }

  return selections;
};
