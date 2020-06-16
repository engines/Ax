ax.extension.form.field.extras.components.controls.multiselect.selected = function (
  f,
  options = {}
) {
  let a = ax.a;

  return a['|appkit-form-multiselect-selected'](null, {
    $state: [],

    $remove: function (item) {
      let state = [...this.$state];
      let index = state.indexOf(item);
      if (index !== -1) {
        state.splice(index, 1);
        this.$state = state;
      }
      this.$send('ax.appkit.form.multiselect.selected.change');
    },

    $add: function (item, index) {
      this.$state = [item].concat(this.$state);
      this.$send('ax.appkit.form.multiselect.selected.change');
    },

    $update: function () {
      if (this.$state.length === 0) {
        this.style.display = 'none';
        this.$('^|appkit-form-multiselect-selected').previousSibling.required =
          options.required;
        this.$nodes = [
          f.input({
            name: options.name + '[]',
            disabled: true,
            inputTag: {
              type: 'hidden',
            },
          }),
        ];
      } else {
        this.style.display = '';
        this.$(
          '^|appkit-form-multiselect-selected'
        ).previousSibling.removeAttribute('required');
        this.$nodes = this.$state.map(function (item) {
          return a['|appkit-form-multiselect-selected-item'](
            [
              a['|appkit-form-multiselect-selected-item-label'](item.label),
              a['button|appkit-form-multiselect-selected-item-remove']('✖', {
                type: 'button',
                $on: {
                  'click: remove item from selection': function (e) {
                    if (!this.disabled) {
                      this.$('^|appkit-form-control')
                        .$('select')
                        .$enableDeselected(item.index);
                      this.$('^|appkit-form-multiselect-selected').$remove(
                        item
                      );
                    }
                  },
                },
                $disable: function () {
                  this.disabled = 'disabled';
                },
                $enable: function () {
                  this.removeAttribute('disabled');
                },
              }),
              f.input({
                name: options.name + '[]',
                required: options.required,
                value: item.value,
                inputTag: {
                  type: 'hidden',
                },
              }),
            ],
            options.itemTag
          );
        });
      }
    },
    ...options.selectedTag,
  });
};
