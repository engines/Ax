ax.extension.form.field.nest.prefab.components.many = function (f, options) {
  let a = ax.a;

  return f.controls.nest({
    ...options,
    form: (ff) => (a, x) => {
      return a['|appkit-form-nest-many-wrapper'](
        [
          ff.items({
            ...options,
            form: (fff) => [
              a['|appkit-form-nest-many-item-header'](
                [
                  a['|appkit-form-nest-many-item-buttons'](
                    [
                      options.moveable ? fff.up(options.upButton) : null,
                      options.moveable ? fff.down(options.downButton) : null,
                      options.removeable
                        ? fff.remove(options.removeButton)
                        : null,
                    ],
                    options.itemButtonsTag
                  ),
                ],
                options.itemHeaderTag
              ),
              a['|appkit-form-nest-many-item-body'](
                options.form(fff),
                options.itemBodyTag
              ),
            ],
            itemsTag: {
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
          }),

          a['|appkit-form-nest-many-footer'](
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
          ),
        ],
        options.wrapperTag
      );
    },
  });
};
