ax.extension.menu = (options = {}) => (a, x) => {
  let items = options.menu || [];

  return a['|appkit-menu'](
    a.menu(
      items.map((item) =>
        ax.is.object(item) ? a.menuitem(x.menu.item(item, options.item)) : item
      )
    ),
    {
      $init: (el) => {
        let z = Number(window.getComputedStyle(el).zIndex);
        el.$$('|appkit-menu-submenu').$setZ(z + 1);
      },
      $closeSubmenus: function () {
        this.$$('|appkit-menu-submenu').style.display = 'none';
      },
      ...options.menuTag,
    }
  );
};
