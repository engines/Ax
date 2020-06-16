ax.extension.menu.item = (item, options = {}) => (a, x) => {
  let component;

  if (item.menu) {
    component = [
      a['|appkit-menu-submenu-open-caret']('⯈'),
      a['|appkit-menu-submenu-open'](item.label),
      a['|appkit-menu-submenu'](
        x.menu({
          menu: item.menu,
        }),
        {
          $setZ: function (z) {
            this.style.zIndex = z;
          },
        }
      ),
    ];
  } else {
    component = x.button({
      label: item.label,
      onclick: item.onclick,
    });
  }

  let openSubmenu = (e, el) => {
    e.preventDefault();
    let target = el.$('|appkit-menu-submenu');
    let submenus = el.$('^|appkit-menu').$$('|appkit-menu-submenu').$$;

    for (let i in submenus) {
      let submenu = submenus[i];
      if (submenu.contains(target)) {
        target.style.display = 'unset';
        nudgeSubmenu(target);
      } else {
        submenu.style.display = 'none';
      }
    }
  };

  let nudgeSubmenu = function (target) {
    let rect;
    rect = target.getBoundingClientRect();
    target.style.top = '0px';
    target.style.left = `${rect.width}px`;
    rect = target.getBoundingClientRect();
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    let bGap = wh - rect.top - rect.height;
    let rGap = ww - rect.left - rect.width;
    if (bGap < 0) target.style.top = `${bGap}px`;
    if (rGap < 0) target.style.left = `${rect.width + rGap}px`;
  };

  let itemTagOptions = {
    ...options.itemTag,
    $on: {
      click: (e, el) => {
        if (e.target.tagName == 'APPKIT-MENU-SUBMENU-OPEN') {
          openSubmenu(e, el);
          e.stopPropagation();
        }
      },
      mouseenter: (e, el) => {
        openSubmenu(e, el);
      },
      ...(options.itemTag || {}).$on,
    },
  };

  return a['|appkit-menu-item'](component, itemTagOptions);
};
