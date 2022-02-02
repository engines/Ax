ax.extension.form.field.nest.prefab.controls.table = function (f, options) {
  let a = ax.a,
    x = ax.x;

  let sortable = x.form.field.nest.sortable;

  return f.controls.nest({
    ...options,
    form: (ff) => (a, x) => {
      let form = options.form || (() => {});

      let tableHeader = () => {
        let ffP = new Proxy(ff, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                if (fieldOptions.as == 'hidden') return null;
                let label = ax.is.false(fieldOptions.label)
                  ? null
                  : fieldOptions.label || x.lib.text.labelize(fieldOptions.key);
                return a.th(
                  a['ax-appkit-form-field']([
                    label,
                    fieldOptions.help
                      ? ff.helpbutton({
                          helpbuttonTag: {
                            $on: {
                              'click: toggle help': (el) => (e) => {
                                el.$showHelp = !el.$showHelp;
                                el.$render()
                                el.$(
                                  '^table',
                                  `ax-appkit-form-field-help[data-field-key="${fieldOptions.key}"]`
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

        let headerCells = () => {
          let cells = form(ffP) || [];
          if (options.itemTitle) {
            cells.unshift(
              a.th(null, {
                width: '10%',
                ...options.thTag,
              })
            );
          }
          if (options.moveable || options.removeable) {
            cells.push(
              a.th(null, {
                width: '10%',
                ...options.thTag,
              })
            );
          }
          return cells;
        };

        return a.thead(a.tr(headerCells(), options.trTag), options.theadTag);
      };

      let tableHelp = () => {
        let ffP = new Proxy(ff, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                if (fieldOptions.as == 'hidden') return null;
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

        let helpCells = () => {
          let cells = form(ffP) || [];
          if (options.moveable || options.removeable)
            cells.push(a.td(null, options.helpTdTag));
          return cells;
        };

        return a.tr(helpCells(), options.helpTrTag);
      };

      let tableHint = () => {
        let ffP = new Proxy(ff, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                if (fieldOptions.as == 'hidden') return null;
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

        let hintCells = () => {
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
                    let content = target[property]({
                      ...fieldOptions,
                      header: false,
                      hint: false,
                      help: false,
                      bodyTag: {
                        ...fieldOptions.bodyTag,
                        class: '',
                      },
                      fieldTag: {
                        ...fieldOptions.fieldTag,
                        class: '',
                      },
                    });
                    if (fieldOptions.as == 'hidden')
                      return a({
                        style: { display: 'none' },
                        $nodes: [content],
                      });
                    return a.td(content, options.tdTag);
                  };
                } else {
                  return target[property];
                }
              },
            });

            let cells = form(fffP);

            if (options.itemTitle) {
              cells.unshift(
                a.td([
                  a['ax-appkit-form-nest-table-item-title'](null, {
                    $nodes: () => options.itemTitle(fffP),
                    name: fffP.scope,
                    $rescope: (el) => () => {
                      el.$render();
                    },
                    ...options.itemTitleTag,
                  }),
                ])
              );
            }

            if (options.moveable || options.removeable)
              cells.push(
                a.td(
                  a['ax-appkit-form-nest-table-item-buttons'](
                    [
                      options.moveable
                        ? fffP.up({
                            ...options.upButton,
                          })
                        : null,
                      options.moveable
                        ? fffP.down({
                            ...options.downButton,
                          })
                        : null,
                      options.removeable
                        ? fffP.remove({
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
              sortstart: (el) => (e) => {
                let item = e.detail.item;
                el.$dragging = item;
              },
              sortupdate: (el) => (e) => {
                el.$dragging = undefined;
                el.$send('ax.appkit.form.nest.item.move');
              },
              ...(options.itemsTag || {}).$on,
            },
            $startDrag: (el) => () => {
              el.$$('ax-appkit-form-nest-drag-off button').click(); // turn off sort on children
              el.$('^ax-appkit-form-nest')
                .$$('ax-appkit-form-nest-add-button button')
                .$disable();
              let buttons = el
                .$(
                  '^ax-appkit-form-nest-table-wrapper |ax-appkit-form-nest-items'
                )
                .$$('button').$$;
              for (let button of buttons) {
                button.$disable && button.$disable();
              }
              sortable(el, {
                items: 'tr',
                forcePlaceholderSize: true,
              });
              el.$drag = true;
            },
            $stopDrag: (el) => () => {
              el.$drag = false;
              sortable(el, 'destroy');
              el.$('^ax-appkit-form-nest')
                .$$('ax-appkit-form-nest-add-button button')
                .$enable();
              let buttons = el
                .$(
                  '^ax-appkit-form-nest-table-wrapper |ax-appkit-form-nest-items'
                )
                .$$('button').$$;
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

      let tableButtons = () => {
        return a['ax-appkit-form-nest-table-footer'](
          [
            options.addable
              ? ff.add({
                  ...options.addButton,
                  target: '^ax-appkit-form-nest tbody',
                })
              : null,

            options.draggable
              ? a['ax-appkit-form-nest-drag-buttons'](
                  [
                    options.deletable
                      ? a['ax-appkit-form-nest-delete']('✖', {
                          tabindex: 0,
                          ...options.deleteTag,
                          $on: {
                            click: (el) => (e) =>
                              alert(
                                `Drag ${
                                  options.singular || 'item'
                                } here to remove it.`
                              ),
                            dragover: (el) => (e) => {
                              let items = el.$(
                                '^ax-appkit-form-nest-table-wrapper |ax-appkit-form-nest-items'
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
                    a['ax-appkit-form-nest-drag-on'](
                      ff.button({
                        label: '⬍',
                        onclick: (el) => (e) => {
                          let dragOn = el.$('^ax-appkit-form-nest-drag-on');
                          let dragOff = el.$(
                            '^ax-appkit-form-nest-drag-buttons ax-appkit-form-nest-drag-off'
                          );
                          let dragDelete = el.$(
                            '^ax-appkit-form-nest-drag-buttons ax-appkit-form-nest-delete'
                          );
                          let items = el.$(
                            '^ax-appkit-form-nest-table-wrapper |ax-appkit-form-nest-items'
                          );
                          items.$startDrag();
                          items
                            .$itemElements()
                            .forEach((item) => (item.tabIndex = 1));
                          dragOn.style.display = 'none';
                          if (dragDelete) dragDelete.style.display = '';
                          dragOff.style.display = '';
                          dragOff.$('button').focus();
                        },
                        ...options.dragOnButton,
                      }),
                      options.dragOnTag
                    ),
                    a['ax-appkit-form-nest-drag-off'](
                      ff.button({
                        label: '⬍',
                        onclick: (el) => (e) => {
                          let dragOff = el.$('^ax-appkit-form-nest-drag-off');
                          let dragOn = el.$(
                            '^ax-appkit-form-nest-drag-buttons ax-appkit-form-nest-drag-on'
                          );
                          let dragDelete = el.$(
                            '^ax-appkit-form-nest-drag-buttons ax-appkit-form-nest-delete'
                          );
                          let items = el.$(
                            '^ax-appkit-form-nest-table-wrapper |ax-appkit-form-nest-items'
                          );
                          items.$stopDrag();
                          items
                            .$itemElements()
                            .forEach((item) =>
                              item.removeAttribute('tabindex')
                            );
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

      return a['ax-appkit-form-nest-table-wrapper'](
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
