ax.extension.form.field.extras.controls.multiselect.selected = function (
  f,
  options = {}
) {
  let a = ax.a;

  return a['ax-appkit-form-multiselect-selected'](null, {
    $state: [],

    $remove: (el) => (item) => {
      let state = [...el.$state];
      let index = state.indexOf(item);
      if (index !== -1) {
        state.splice(index, 1);
        el.$state = state;
      }
      el.$send('ax.appkit.form.multiselect.selected.change');
    },

    $add: (el) => (item, index) => {
      el.$state = [item].concat(el.$state);
      el.$send('ax.appkit.form.multiselect.selected.change');
    },

    $update: (el) => {
      if (el.$state.length === 0) {
        el.style.display = 'none';
        el.$('^ax-appkit-form-multiselect-selected').previousSibling.required =
          options.required;
        el.$nodes = [
          f.input({
            name: options.name + '[]',
            disabled: true,
            inputTag: {
              type: 'hidden',
            },
          }),
        ];
      } else {
        el.style.display = '';
        el.$(
          '^ax-appkit-form-multiselect-selected'
        ).previousSibling.removeAttribute('required');
        el.$nodes = el.$state.map(function (item) {
          return a['ax-appkit-form-multiselect-selected-item'](
            [
              a['ax-appkit-form-multiselect-selected-item-label'](item.label),
              a['ax-appkit-form-multiselect-selected-item-remove'](
                a.button('✖', { type: 'button' }),
                {
                  $on: {
                    'click: remove item from selection': (e, el) => {
                      if (!el.disabled) {
                        el.$('^ax-appkit-form-control')
                          .$('select')
                          .$enableDeselected(item.index);
                        el.$('^ax-appkit-form-multiselect-selected').$remove(
                          item
                        );
                      }
                    },
                  },
                  $disable: (el) => () => {
                    el.$('button').disabled = 'disabled';
                  },
                  $enable: (el) => () => {
                    el.$('button').removeAttribute('disabled');
                  },
                }
              ),
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
