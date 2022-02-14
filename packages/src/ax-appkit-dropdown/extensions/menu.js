ax.extensions.menu = (options = {}) => (a, x) => {
  let items = options.menu || [];

  return a['ax-appkit-menu'](
    a.menu(
      items.map((item) =>
        ax.is.object(item) ? a.menuitem(x.menu.item(item, options.item)) : item
      )
    ),
    {
      $init: (el) => {
        let z = Number(window.getComputedStyle(el).zIndex);
        el.$$('ax-appkit-menu-submenu').$setZ(z + 1);
      },
      $closeSubmenus: (el) => () => {
        el.$$('ax-appkit-menu-submenu').style.display = 'none';
      },
      ...options.menuTag,
    }
  );
};
