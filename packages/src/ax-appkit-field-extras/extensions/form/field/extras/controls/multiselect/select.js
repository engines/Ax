ax.extensions.form.field.extras.controls.multiselect.select = function (
  f,
  options = {}
) {
  return f.select(
    // No name on select. Field name goes on hidden inputs.
    {
      placeholder: options.placeholder || '＋ Add',
      ...options.select,
      selections: options.selections,
      selectTag: {
        $on: {
          'change: add item to selection': (e) => {
            let el = e.currentTarget
            el.$(
              '^ax-appkit-form-control ax-appkit-form-multiselect-selected'
            ).$add({
              index: el.selectedIndex,
              value: el.value,
              label: el.options[el.selectedIndex].text,
            });
            el.$disableSelected();
          },
        },

        $disableSelected: (el) => () => {
          el.options[el.selectedIndex].disabled = 'disabled';
          el.selectedIndex = 0;
        },

        $enableDeselected: (el) => (index) => {
          el.options[index].removeAttribute('disabled');
        },

        ...(options.select || {}).selectTag,
      },
    }
  );
};
