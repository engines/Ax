// Ax, copyright (c) Lachlan Douglas
// Distributed under an MIT license: https://github.com/engines/Ax/LICENSE.md
;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = {
      extend: (ax, dependencies={}) => factory(ax, dependencies)
    };
  } else {
    factory(root.ax)
  }
}(this, function(ax, dependencies={}) {

const a = ax.a,
      x = ax.x,
      is = ax.is;

ax.extensions.table = (options = {}) => (a,x) => {
  const header = options.header || []
  const data = options.data || []
  const tableTag = options.tableTag || {}
  const theadTag = options.theadTag || {}
  const tbodyTag = options.tbodyTag || {}
  const thTag = {scope: 'col', ...options.thTag}
  const trTag = options.trTag || {}
  const tdTag = options.tdTag || {}

  let tbodyNodes = [];
  let tableNodes = [];

  if(header) {
    tableNodes.push(a.thead(
      a.tr(
        data.shift().map(thNodes => a.th(thNodes, thTag)),
        trTag
      ),
      theadTag
    ))
  }

  for(let row of data) {
    tbodyNodes.push(
      a.tr(
        row.map(tdNodes => a.td(tdNodes, tdTag)),
        trTag
      )
    )
  }

  tableNodes.push(a.tbody(tbodyNodes, tbodyTag))

  return a.table(tableNodes, tableTag);
};

ax.extensions.form.field.nest.sortable =
  dependencies.sortable || window.sortable;

ax.extensions.form.field.nest.prefab = {};

ax.extensions.report.field.nest.prefab = {};

ax.extensions.form.field.nest.prefab.controls = {};

ax.css({
  'ax-appkit-form-nest [draggable]': {
    $: {
      cursor: 'grab',
    },
    'input, textarea, select, button': {
      $: {
        pointerEvents: 'none',
      },
    },
  },
  'ax-appkit-form-nest [draggable]:active': {
    $: {
      cursor: 'grabbing',
    },
  },
});

ax.extensions.form.field.nest.prefab.shim = {
  controls: {
    table: (f) => (options) =>
      ax.x.form.field.nest.prefab.controls.table(f, options),
    many: (f) => (options) =>
      ax.x.form.field.nest.prefab.controls.many(f, options),
    one: (f) => (options) => f.controls.nest(options),
  },
};

ax.extensions.report.field.nest.prefab.controls = {};

ax.extensions.report.field.nest.prefab.shim = {
  controls: {
    table: (r) => (options) =>
      ax.x.report.field.nest.prefab.controls.table(r, options),
    many: (r) => (options) =>
      ax.x.report.field.nest.prefab.controls.many(r, options),
    one: (r) => (options) => r.controls.nest(options),
  },
};

ax.extensions.form.field.nest.prefab.controls.many = function (f, options) {
  let sortable = x.form.field.nest.sortable;

  return f.controls.nest({
    ...options,
    form: (ff) => {
      return a['ax-appkit-form-nest-many-wrapper'](
        [
          ff.items({
            ...options.items,
            form: (fff) => [
              a['ax-appkit-form-nest-many-item-header'](
                [
                  options.itemTitle
                    ? a['ax-appkit-form-nest-many-item-title']({
                        $nodes: () => options.itemTitle(fff),
                        name: fff.scope,
                        $rescope: (el) => () => {
                          el.$render();
                        },
                        ...options.itemTitleTag,
                      })
                    : '',
                  a['ax-appkit-form-nest-many-item-buttons'](
                    [
                      options.moveable ? fff.up(options.upButton) : '',
                      options.moveable ? fff.down(options.downButton) : '',
                      options.removeable
                        ? fff.remove(options.removeButton)
                        : '',
                    ],
                    options.itemButtonsTag || {}
                  ),
                ],
                options.itemHeaderTag || {}
              ),
              a['ax-appkit-form-nest-many-item-body'](
                options.form(fff),
                options.itemBodyTag || {}
              ),
            ],
            itemsTag: {
              ...options.itemsTag,
              $on: {
                sortstart: (e, el) => {
                  let item = e.detail.item;
                  el.$dragging = item;
                },
                sortupdate: (e, el) => {
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
                    '^ax-appkit-form-nest-many-wrapper ax-appkit-form-nest-items'
                  )
                  .$$('button').$$;
                for (let button of buttons) {
                  button.$disable && button.$disable();
                }
                sortable(el, {
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
                    '^ax-appkit-form-nest-many-wrapper ax-appkit-form-nest-items'
                  )
                  .$$('button').$$;
                for (let button of buttons) {
                  button.$enable && button.$enable();
                }
              },
            },
          }),

          a['ax-appkit-form-nest-many-footer'](
            [
              options.addable ? ff.add(options.addButton) : '',

              options.draggable
                ? a['ax-appkit-form-nest-drag-buttons'](
                    [
                      options.deletable
                        ? a['ax-appkit-form-nest-delete']('✖', {
                            tabindex: 0,
                            ...options.deleteTag,
                            $on: {
                              click: (e, el) =>
                                alert(
                                  `Drag ${
                                    options.singular || 'item'
                                  } here to remove it.`
                                ),
                              dragover: (e, el) => {
                                let items = el.$(
                                  '^ax-appkit-form-nest-many-wrapper ax-appkit-form-nest-items'
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
                        : '',
                      a['ax-appkit-form-nest-drag-on'](
                        ff.button({
                          label: '⬍',
                          onclick: (e, el) => {
                            let dragOn = el.$('^ax-appkit-form-nest-drag-on');
                            let dragOff = el.$(
                              '^ax-appkit-form-nest-drag-buttons ax-appkit-form-nest-drag-off'
                            );
                            let dragDelete = el.$(
                              '^ax-appkit-form-nest-drag-buttons ax-appkit-form-nest-delete'
                            );
                            el.$(
                              '^ax-appkit-form-nest-many-wrapper ax-appkit-form-nest-items'
                            ).$startDrag();
                            el.$(
                              '^ax-appkit-form-nest-many-wrapper ax-appkit-form-nest-items'
                            )
                              .$itemElements()
                              .forEach((item) => (item.tabIndex = 1));
                            dragOn.style.display = 'none';
                            if (dragDelete) dragDelete.style.display = '';
                            dragOff.style.display = '';
                            dragOff.$('button').focus();
                          },
                          ...options.dragOnButton,
                        }),
                        options.dragOnTag || {}
                      ),
                      a['ax-appkit-form-nest-drag-off'](
                        ff.button({
                          label: '⬍',
                          onclick: (e, el) => {
                            let dragOff = el.$('^ax-appkit-form-nest-drag-off');
                            let dragOn = el.$(
                              '^ax-appkit-form-nest-drag-buttons ax-appkit-form-nest-drag-on'
                            );
                            let dragDelete = el.$(
                              '^ax-appkit-form-nest-drag-buttons ax-appkit-form-nest-delete'
                            );
                            el.$(
                              '^ax-appkit-form-nest-many-wrapper ax-appkit-form-nest-items'
                            ).$stopDrag();
                            el.$(
                              '^ax-appkit-form-nest-many-wrapper ax-appkit-form-nest-items'
                            )
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
                    options.dragButtonsTag || {}
                  )
                : '',
            ],
            options.footerTag || {}
          ),
        ],
        options.wrapperTag || {}
      );
    },
  });
};

ax.extensions.form.field.nest.prefab.controls.table = function (f, options) {
  let sortable = x.form.field.nest.sortable;

  return f.controls.nest({
    ...options,
    itemsTagName: 'tbody',
    form: (ff) => {
      let form = options.form || (() => {});

      let tableHeader = () => {
        let ffP = new Proxy(ff, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                if (fieldOptions.as == 'hidden') return '';
                let label = ax.is.false(fieldOptions.label)
                  ? ''
                  : fieldOptions.label || x.lib.text.labelize(fieldOptions.key);
                return a.th(
                  a['ax-appkit-form-field']([
                    label,
                    fieldOptions.help
                      ? ff.helpbutton({
                          helpbuttonTag: {
                            $on: {
                              'click: toggle help': (e, el) => {
                                el.$showHelp = !el.$showHelp;
                                el.$render();
                                el.$(
                                  '^table',
                                  `ax-appkit-form-field-help[data-field-key="${fieldOptions.key}"]`
                                ).$toggle();
                              },
                            },
                          },
                        })
                      : '',
                  ]),
                  options.thTag || {}
                );
              };
            } else {
              return a.td(options.tdTag || {});
            }
          },
        });

        let headerCells = () => {
          let cells = form(ffP) || [];
          if (options.itemTitle) {
            cells.unshift(
              a.th({
                width: '10%',
                ...options.thTag,
              })
            );
          }
          if (options.moveable || options.removeable) {
            cells.push(
              a.th({
                width: '10%',
                ...options.thTag,
              })
            );
          }
          return cells;
        };

        return a.thead(a.tr(headerCells(), options.tdTag || {}), options.tdTag || {});
      };

      let tableHelp = () => {
        let ffP = new Proxy(ff, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                if (fieldOptions.as == 'hidden') return '';
                return a.td(
                  ff.help({
                    help: fieldOptions.help,
                    helpTag: {
                      'data-field-key': fieldOptions.key,
                      ...options.helpTag,
                    },
                  }),
                  options.helpTdTag || {}
                );
              };
            } else {
              return a.td(options.tdTag || {});
            }
          },
        });

        let helpCells = () => {
          let cells = form(ffP) || [];
          if (options.moveable || options.removeable)
            cells.push(a.td(options.tdTag || {}));
          return cells;
        };

        return a.tr(helpCells(), options.tdTag || {});
      };

      let tableHint = () => {
        let ffP = new Proxy(ff, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                if (fieldOptions.as == 'hidden') return '';
                return a.td(
                  ff.hint({
                    hint: fieldOptions.hint,
                    hintTag: options.hintTag,
                  }),
                  options.hintTdTag || {}
                );
              };
            } else {
              return a.td(options.tdTag || {});
            }
          },
        });

        let hintCells = () => {
          let cells = form(ffP) || [];
          if (options.moveable || options.removeable)
            cells.push(a.td(options.tdTag || {}));
          return cells;
        };

        return a.tr(hintCells(), options.tdTag || {});
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
                    return a.td(content, options.tdTag || {});
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
                  a['ax-appkit-form-nest-table-item-title']({
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
                            itemsTagName: 'tbody',
                          })
                        : '',
                      options.moveable
                        ? fffP.down({
                            ...options.downButton,
                            itemsTagName: 'tbody',
                          })
                        : '',
                      options.removeable
                        ? fffP.remove({
                            ...options.removeButton,
                            itemsTagName: 'tbody',
                          })
                        : '',
                    ],
                    options.itemButtonsTag || {}
                  ),
                  options.tdTag || {}
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
              },
              sortupdate: (e, el) => {
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
                .$('^ax-appkit-form-nest-table-wrapper tbody')
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
                .$('^ax-appkit-form-nest-table-wrapper tbody')
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
                  itemsTagName: 'tbody',
                })
              : '',

            options.draggable
              ? a['ax-appkit-form-nest-drag-buttons'](
                  [
                    options.deletable
                      ? a['ax-appkit-form-nest-delete']('✖', {
                          tabindex: 0,
                          ...options.deleteTag,
                          $on: {
                            click: (e, el) =>
                              alert(
                                `Drag ${
                                  options.singular || 'item'
                                } here to remove it.`
                              ),
                            dragover: (e, el) => {
                              let items = el.$(
                                '^ax-appkit-form-nest-table-wrapper tbody'
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
                      : '',
                    a['ax-appkit-form-nest-drag-on'](
                      ff.button({
                        label: '⬍',
                        onclick: (e, el) => {
                          let dragOn = el.$('^ax-appkit-form-nest-drag-on');
                          let dragOff = el.$(
                            '^ax-appkit-form-nest-drag-buttons ax-appkit-form-nest-drag-off'
                          );
                          let dragDelete = el.$(
                            '^ax-appkit-form-nest-drag-buttons ax-appkit-form-nest-delete'
                          );
                          let items = el.$(
                            '^ax-appkit-form-nest-table-wrapper tbody'
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
                      options.dragOnTag || {}
                    ),
                    a['ax-appkit-form-nest-drag-off'](
                      ff.button({
                        label: '⬍',
                        onclick: (e, el) => {
                          let dragOff = el.$('^ax-appkit-form-nest-drag-off');
                          let dragOn = el.$(
                            '^ax-appkit-form-nest-drag-buttons ax-appkit-form-nest-drag-on'
                          );
                          let dragDelete = el.$(
                            '^ax-appkit-form-nest-drag-buttons ax-appkit-form-nest-delete'
                          );
                          let items = el.$(
                            '^ax-appkit-form-nest-table-wrapper tbody'
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
                  options.dragButtonsTag || {}
                )
              : '',
          ],
          options.footerTag || {}
        );
      };

      return a['ax-appkit-form-nest-table-wrapper'](
        [
          a['ax-appkit-form-nest-items'](
            [
              a.table(
                [tableHeader(), tableHelp(), tableBody(), tableHint()],
                options.tableTag || {}
              ),
              tableButtons(),
            ],
            {}
          ),
        ],
        options.wrapperTag || {}
      );
    },
  });
};

ax.extensions.report.field.nest.prefab.controls.many = function (r, options) {
  return r.controls.nest({
    ...options,
    report: (rr) => a['ax-appkit-report-nest-many-wrapper'](
      [
        rr.items({
          ...options,
          report: (rrr) => [
            a['ax-appkit-report-nest-many-item-header'](
              options.itemHeaderTag || {}
            ),
            a['ax-appkit-report-nest-many-item-body'](
              options.report(rrr),
              options.itemBodyTag || {}
            ),
          ],
        }),
      ],
      options.wrapperTag || {}
    ),
  });
};

ax.extensions.report.field.nest.prefab.controls.table = function (r, options) {
  return r.controls.nest({
    ...options,
    report: (rr) => {
      let report = options.report || (() => {});

      let tableHeader = function () {
        let rrP = new Proxy(rr, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                let label = ax.is.false(fieldOptions.label)
                  ? ''
                  : fieldOptions.label || x.lib.text.labelize(fieldOptions.key);
                return a.th(
                  a['ax-appkit-report-field']([
                    label,
                    fieldOptions.help
                      ? r.helpbutton({
                          helpbuttonTag: {
                            $on: {
                              'click: toggle help': (e, el) => {
                                el.$showHelp = !el.$showHelp;
                                el.$render();
                                el.$(
                                  '^table',
                                  `ax-appkit-report-field-help[data-field-key="${fieldOptions.key}"]`
                                ).$toggle();
                              },
                            },
                          },
                        })
                      : '',
                  ]),
                  options.thTag || {}
                );
              };
            } else {
              return a.td(options.tdTag || {}); // empty cell
            }
          },
        });

        let headerCells = function () {
          let cells = report(rrP) || [];
          return cells;
        };

        return a.thead(a.tr(headerCells(), options.trTag || {}), options.theadTag || {});
      };

      let tableHelp = function () {
        let rrP = new Proxy(rr, {
          get: (target, property) => {
            if (property === 'field') {
              return (fieldOptions) => {
                return a.td(
                  rr.help({
                    help: fieldOptions.help,
                    helpTag: {
                      ...options.helpTag,
                      'data-field-key': fieldOptions.key,
                    },
                  }),
                  options.helpTdTag || {}
                );
              };
            } else {
              return a.td(options.helpTdTag || {}); // empty cell
            }
          },
        });

        let helpCells = function () {
          let cells = report(rrP) || [];
          return cells;
        };

        return a.tr(helpCells(), options.helpTrTag || {});
      };

      let tableHint = function () {
        let rrP = new Proxy(rr, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                return a.td(
                  rr.hint({
                    hint: fieldOptions.hint,
                    hintTag: options.hintTag,
                  }),
                  options.hintTdTag || {}
                );
              };
            } else {
              return a.td(options.hintTdTag || {}); // empty cell
            }
          },
        });

        let hintCells = function () {
          let cells = report(rrP) || [];
          return cells;
        };

        return a.tr(hintCells(), options.hintTrTag || {});
      };

      let tableBody = () =>
        rr.items({
          ...options.items,
          report: (rrr) => {
            let rrrP = new Proxy(rrr, {
              get: (target, property) => {
                if (property == 'field') {
                  return (fieldOptions) => {
                    return a.td(rrr.control(fieldOptions), options.tdTag || {});
                  };
                } else {
                  return target[property];
                }
              },
            });

            let cells = report(rrrP);

            return cells;
          },
          itemsTag: {
            $tag: 'tbody',
            ...options.tbodyTag,
            ...options.itemsTag,
          },
          itemTag: {
            $tag: 'tr',
            ...options.trTag,
            ...options.itemTag,
          },
        });

      return a['ax-appkit-report-nest-table-wrapper'](
        [
          a.table(
            [tableHeader(), tableHelp(), tableBody(), tableHint()],
            options.tableTag || {}
          ),
        ],
        options.wrapperTag || {}
      );
    },
  });
};

}));
