ax.extension.form.field.nest.prefab.controls.many = function (f, options) {
  let a = ax.a,
    x = ax.x;

  let sortable = x.form.field.nest.sortable;

  return f.controls.nest({
    ...options,
    form: (ff) => (a, x) => {
      return a['ax-appkit-form-nest-many-wrapper'](
        [
          ff.items({
            ...options.items,
            form: (fff) => [
              a['ax-appkit-form-nest-many-item-header'](
                [
                  a['ax-appkit-form-nest-many-item-buttons'](
                    [
                      options.moveable ? fff.up(options.upButton) : null,
                      options.moveable ? fff.down(options.downButton) : null,
                      options.removeable
                        ? fff.remove(options.removeButton)
                        : null,
                    ],
                    options.itemMenuTag
                  ),
                ],
                options.itemHeaderTag
              ),
              a['ax-appkit-form-nest-many-item-body'](
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
                    '^ax-appkit-form-nest-many-wrapper |ax-appkit-form-nest-items'
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
                    '^ax-appkit-form-nest-many-wrapper |ax-appkit-form-nest-items'
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
              options.addable ? ff.add(options.addButton) : null,

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
                                  '^ax-appkit-form-nest-many-wrapper |ax-appkit-form-nest-items'
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
                          onclick: (e, el) => {
                            let dragOn = el.$('^ax-appkit-form-nest-drag-on');
                            let dragOff = el.$(
                              '^ax-appkit-form-nest-drag-buttons ax-appkit-form-nest-drag-off'
                            );
                            let dragDelete = el.$(
                              '^ax-appkit-form-nest-drag-buttons ax-appkit-form-nest-delete'
                            );
                            el.$(
                              '^ax-appkit-form-nest-many-wrapper |ax-appkit-form-nest-items'
                            ).$startDrag();
                            el.$(
                              '^ax-appkit-form-nest-many-wrapper |ax-appkit-form-nest-items'
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
                        options.dragOnTag
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
                              '^ax-appkit-form-nest-many-wrapper |ax-appkit-form-nest-items'
                            ).$stopDrag();
                            el.$(
                              '^ax-appkit-form-nest-many-wrapper |ax-appkit-form-nest-items'
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
