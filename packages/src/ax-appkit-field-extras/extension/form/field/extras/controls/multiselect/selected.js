ax.extension.form.field.extras.controls.multiselect.selected = function (
  f,
  options = {}
) {
  let a = ax.a;

  return a['ax-appkit-form-multiselect-selected'](null, {
    $selected: [],

    $remove: (el) => (item) => {
      let selected = [...el.$selected];
      let index = selected.indexOf(item);
      if (index !== -1) {
        selected.splice(index, 1);
        el.$update(selected);
      }
      el.$send('ax.appkit.form.multiselect.selected.change');
    },

    $add: (el) => (item, index) => {
      el.$update([item].concat(el.$selected));
      el.$send('ax.appkit.form.multiselect.selected.change');
    },

    $update: (el) => (selected) => {
      el.$selected = selected;
      if (el.$selected.length === 0) {
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
        el.$nodes = el.$selected.map(function (item) {
          return a['ax-appkit-form-multiselect-selected-item'](
            [
              a['ax-appkit-form-multiselect-selected-item-label'](item.label),
              a['ax-appkit-form-multiselect-selected-item-remove'](
                a.button('✖', { type: 'button' }),
                {
                  $on: {
                    'click: remove item from selection': (el) => (e) => {
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
                  $enabled: true,
                  $disable: (el) => () => {
                    el.$enabled = false;
                    el.$('button').disabled = 'disabled';
                  },
                  $enable: (el) => () => {
                    el.$enabled = true;
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
