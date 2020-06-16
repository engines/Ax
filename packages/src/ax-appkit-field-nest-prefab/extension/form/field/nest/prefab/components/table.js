ax.extension.form.field.nest.prefab.components.table = function (f, options) {
  let a = ax.a;

  return f.controls.nest({
    ...options,
    form: (ff) => (a, x) => {
      let form = options.form || (() => {});

      let tableHeader = function () {
        let ffP = new Proxy(ff, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                let label = ax.is.false(fieldOptions.label)
                  ? null
                  : fieldOptions.label || x.lib.text.labelize(fieldOptions.key);
                return a.th(
                  a['|appkit-form-field']([
                    label,
                    fieldOptions.help
                      ? ff.helpbutton({
                          helpbuttonTag: {
                            $on: {
                              'click: toggle help': function () {
                                this.$state = !this.$state;
                                this.$(
                                  '^table',
                                  `|appkit-form-field-help[data-field-key="${fieldOptions.key}"]`
                                ).$toggle();
                              },
                            },
                          },
                        })
                      : null,
                  ]),
                  options.thTag
                );
              };
            } else {
              return a.td(null, options.tdTag);
            }
          },
        });

        let headerCells = function () {
          let cells = form(ffP) || [];
          if (options.moveable || options.removeable)
            cells.push(
              a.th(null, {
                width: '10%',
                ...options.thTag,
              })
            );
          return cells;
        };

        return a.thead(a.tr(headerCells(), options.trTag), options.theadTag);
      };

      let tableHelp = function () {
        let ffP = new Proxy(ff, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                return a.td(
                  ff.help({
                    help: fieldOptions.help,
                    helpTag: {
                      'data-field-key': fieldOptions.key,
                      ...options.helpTag,
                    },
                  }),
                  options.helpTdTag
                );
              };
            } else {
              return a.td(null, options.helpTdTag);
            }
          },
        });

        let helpCells = function () {
          let cells = form(ffP) || [];
          if (options.moveable || options.removeable)
            cells.push(a.td(null, options.helpTdTag));
          return cells;
        };

        return a.tr(helpCells(), options.helpTrTag);
      };

      let tableHint = function () {
        let ffP = new Proxy(ff, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                return a.td(
                  ff.hint({
                    hint: fieldOptions.hint,
                    hintTag: options.hintTag,
                  }),
                  options.hintTdTag
                );
              };
            } else {
              return a.td(null, options.hintTdTag);
            }
          },
        });

        let hintCells = function () {
          let cells = form(ffP) || [];
          if (options.moveable || options.removeable)
            cells.push(a.td(null, options.helpTdTag));
          return cells;
        };

        return a.tr(hintCells(), options.hintTrTag);
      };

      let tableBody = () =>
        ff.items({
          ...options.items,
          form: (fff) => {
            let fffP = new Proxy(fff, {
              get: (target, property) => {
                if (property == 'field') {
                  return (fieldOptions) => {
                    return a.td(fff.control(fieldOptions), options.tdTag);
                  };
                } else {
                  return target[property];
                }
              },
            });

            let cells = form(fffP);

            if (options.moveable || options.removeable)
              cells.push(
                a.td(
                  a['|appkit-form-nest-table-item-buttons'](
                    [
                      options.moveable
                        ? fffP.up({
                            // itemTarget: (el) => el.$('^tr'),
                            ...options.upButton,
                          })
                        : null,
                      options.moveable
                        ? fffP.down({
                            // itemTarget: (el) => el.$('^tr'),
                            ...options.downButton,
                          })
                        : null,
                      options.removeable
                        ? fffP.remove({
                            // itemTarget: (el) => el.$('^tr'),
                            ...options.removeButton,
                          })
                        : null,
                    ],
                    options.itemButtonsTag
                  ),
                  options.tdTag
                )
              );

            return cells;
          },
          itemsTag: {
            $tag: 'tbody',
            ...options.itemsTag,
            $on: {
              sortstart: (e, el) => {
                let item = e.detail.item;
                el.$dragging = item;
                el.$send('ax.appkit.form.table.drag.start', {
                  detail: e.detail,
                });
              },
              sortstop: (e, el) => {
                el.$send('ax.appkit.form.table.drag.stop', {
                  detail: e.detail,
                });
              },
              sortupdate: (e, el) => {
                this.$dragging = undefined;
                el.$rescopeItems();
                el.$send('ax.appkit.form.table.drag.update', {
                  detail: e.detail,
                });
              },
              ...(options.itemsTag || {}).$on,
            },
            $startDrag: function () {
              this.$$('|appkit-form-nest-drag-off button').click(); // turn off sort on children
              this.$('^|appkit-form-nest')
                .$$('|appkit-form-nest-add-button button')
                .$disable();
              let buttons = this.$(
                '^|appkit-form-nest |appkit-form-nest-items'
              ).$$('button').$$;
              for (let button of buttons) {
                button.$disable && button.$disable();
              }
              sortable(this, {
                items: 'tr',
                forcePlaceholderSize: true,
              });
              this.$drag = true;
            },
            $stopDrag: function () {
              this.$drag = false;
              sortable(this, 'destroy');
              this.$('^|appkit-form-nest')
                .$$('|appkit-form-nest-add-button button')
                .$enable();
              let buttons = this.$(
                '^|appkit-form-nest |appkit-form-nest-items'
              ).$$('button').$$;
              for (let button of buttons) {
                button.$enable && button.$enable();
              }
            },
          },
          itemTag: {
            $tag: 'tr',
            ...options.itemTag,
          },
        });

      let tableButtons = function () {
        return a['|appkit-form-nest-table-footer'](
          [
            options.addable ? ff.add(options.addButton) : null,

            options.draggable
              ? a['|appkit-form-nest-drag-buttons'](
                  [
                    options.deletable
                      ? a['|appkit-form-nest-delete']('✖', {
                          tabindex: 1,
                          ...options.deleteTag,
                          $on: {
                            click: () =>
                              alert(
                                `Drag ${
                                  options.singular || 'item'
                                } here to remove it.`
                              ),
                            dragover: (e, el) => {
                              let items = el.$(
                                '^|appkit-form-nest |appkit-form-nest-items'
                              );
                              let item = items.$dragging;
                              if (item.contains(item)) {
                                confirmation = confirm(
                                  `Are you sure that you want to remove this ${
                                    options.singular || 'item'
                                  }?`
                                );
                                if (confirmation) item.remove();
                              }
                            },
                            ...(options.deleteTag || {}).$on,
                          },
                          style: {
                            ...(options.deleteTag || {}).style,
                            display: 'none',
                          },
                        })
                      : null,
                    a['|appkit-form-nest-drag-on'](
                      ff.button({
                        label: '⬍',
                        onclick: (e, el) => {
                          let dragOn = el.$('^|appkit-form-nest-drag-on');
                          let dragOff = el.$(
                            '^|appkit-form-nest-drag-buttons |appkit-form-nest-drag-off'
                          );
                          let dragDelete = el.$(
                            '^|appkit-form-nest-drag-buttons |appkit-form-nest-delete'
                          );
                          el.$(
                            '^|appkit-form-nest |appkit-form-nest-items'
                          ).$startDrag();
                          el
                            .$('^|appkit-form-nest')
                            .$$('|appkit-form-nest-item').tabIndex = 1;
                          dragOn.style.display = 'none';
                          if (dragDelete) dragDelete.style.display = '';
                          dragOff.style.display = '';
                          dragOff.$('button').focus();
                        },
                        ...options.dragOnButton,
                      }),
                      options.dragOnTag
                    ),
                    a['|appkit-form-nest-drag-off'](
                      ff.button({
                        label: '⬍',
                        onclick: (e, el) => {
                          let dragOff = el.$('^|appkit-form-nest-drag-off');
                          let dragOn = el.$(
                            '^|appkit-form-nest-drag-buttons |appkit-form-nest-drag-on'
                          );
                          let dragDelete = el.$(
                            '^|appkit-form-nest-drag-buttons |appkit-form-nest-delete'
                          );
                          el.$(
                            '^|appkit-form-nest |appkit-form-nest-items'
                          ).$stopDrag();
                          el.$('^|appkit-form-nest')
                            .$$('|appkit-form-nest-item')
                            .removeAttribute('tabindex');
                          dragOff.style.display = 'none';
                          if (dragDelete) dragDelete.style.display = 'none';
                          dragOn.style.display = '';
                          dragOn.$('button').focus();
                        },
                        ...options.dragOffButton,
                      }),
                      {
                        ...options.dragOffTag,
                        style: {
                          ...(options.dragOffTag || {}).style,
                          display: 'none',
                        },
                      }
                    ),
                  ],
                  options.dragButtonsTag
                )
              : null,
          ],
          options.footerTag
        );
      };

      return a['|appkit-form-nest-table-wrapper'](
        [
          a.table(
            [tableHeader(), tableHelp(), tableBody(), tableHint()],
            options.tableTag
          ),
          tableButtons(),
        ],
        options.wrapperTag
      );
    },
  });
};
