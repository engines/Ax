ax.extension.form.field.extras.components.controls.multiselect.select = function (
  f,
  options = {}
) {
  let a = ax.a;

  return f.select(
    // No name on select. Field name goes on hidden inputs.
    {
      placeholder: options.placeholder || '＋ Add',
      ...options.select,
      selections: options.selections,
      selectTag: {
        $on: {
          'change: add item to selection': function (e, el) {
            this.$(
              '^|appkit-form-control |appkit-form-multiselect-selected'
            ).$add({
              index: this.selectedIndex,
              value: this.value,
              label: this.options[this.selectedIndex].text,
            });
            this.$disableSelected();
          },
        },

        $disableSelected: function () {
          this.options[this.selectedIndex].disabled = 'disabled';
          this.selectedIndex = 0;
        },

        $enableDeselected: function (index) {
          this.options[index].removeAttribute('disabled');
        },

        ...(options.select || {}).selectTag,
      },
    }
  );
};
