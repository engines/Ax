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

ax.extensions.context = function (options = {}) {
  let component = options.content || '';

  let popupTagOptions = {
    ...options.popupTag,
    style: {
      position: 'absolute',
      zIndex: 1,
      ...(options.popupTag || {}).style,
    },
  };

  let contextTagOptions = {
    $on: {
      click: (e) => {
        let el = e.currentTarget;
        if (options.menu) {
          let menu = el.$('ax-appkit-menu');
          menu && menu.$closeSubmenus();
        }
        el.$('ax-appkit-context-popup').style.display = 'none';
      },
    },
    $menu: (el) => () => {
      let parent = el.$('^ ^ax-appkit-context');
      let menu = options.menu || [];
      if (parent) {
        menu.push(...parent.$menu());
      }

      return menu;
    },
    ...options.contextTag,
    style: {
      cursor: 'context-menu',
      ...(options.contextTag || {}).style,
    },
  };

  let nudgePopup = function (target) {
    let rect = target.getBoundingClientRect();
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    let bGap = wh - rect.top - rect.height;
    let rGap = ww - rect.left - rect.width;
    if (bGap < 0) target.style.top = `${rect.y + bGap}px`;
    if (rGap < 0) target.style.left = `${rect.x + rGap}px`;
  };

  let contentTagOptions = {
    $init: (el) => {
      let popupContents;
      let context = el.$('^ax-appkit-context');

      if (options.menu) {
        if (ax.is.function(x.menu)) {
          popupContents = x.menu({
            menu: context.$menu(),
          });
        } else {
          popupContents = options.menu;
        }
      } else {
        popupContents = options.popup || '';
      }

      let popup = context.$('ax-appkit-context-popup');

      let clickHandler = function (e) {
        if (!popup.contains(e.target)) {
          if (options.menu) {
            let menu = popup.$('ax-appkit-menu');
            menu && menu.$closeSubmenus();
          }
          popup.style.display = 'none';
          removeClickHandler();
          el.$send('ax.appkit.context.popup.close');
        }
      };

      let removeClickHandler = function () {
        window.document.removeEventListener('mousedown', clickHandler);
      };

      let addClickHandler = function () {
        window.document.addEventListener('mousedown', clickHandler);
      };

      el.$on({
        contextmenu: (e) => {
          let el = e.currentTarget;
          e.preventDefault();
          e.stopPropagation();
          popup.$nodes = [popupContents];
          popup.style.left = `${e.pageX + 1}px`;
          popup.style.top = `${e.pageY + 1}px`;
          popup.style.display = 'inline-block';
          nudgePopup(popup);
          addClickHandler();
          el.$send('ax.appkit.context.popup.show');
        },
      });
    },
    ...options.contentTag,
  };

  return a['ax-appkit-context'](
    [
      a['ax-appkit-context-content'](component, contentTagOptions),
      a['ax-appkit-context-popup'](popupTagOptions),
    ],
    contextTagOptions
  );
};

ax.extensions.menu = (options = {}) => {
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

ax.extensions.popup = function (component, options = {}) {
  let popupTagOptions = {
    ...options.popupTag,
    style: {
      position: 'absolute',
      zIndex: 1,
      ...(options.popupTag || {}).style,
    },
  };

  let contextTagOptions = {
    $on: {
      'click: close submenus': (e) => {
        let el = e.currentTarget;
        if (options.menu) {
          let menu = el.$('ax-appkit-menu');
          menu && menu.$closeSubmenus();
        }
        el.$('ax-appkit-context-popup').style.display = 'none';
      },
    },
    $menu: (el) => () => {
      let parent = el.$('^ ^ax-appkit-context');
      let menu = options.menu || [];
      if (parent) {
        menu.push(...parent.$menu());
      }

      return menu;
    },
    ...options.contextTag,
  };

  let nudgePopup = function (target) {
    let rect = target.getBoundingClientRect();
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    let bGap = wh - rect.top - rect.height;
    let rGap = ww - rect.left - rect.width;
    if (rGap < 0) target.style.left = `${rGap}px`;
  };

  let contentTagOptions = {
    $clickHandler: (el) => (e) => {
      let context = el.$('^ax-appkit-context');
      if (!context.contains(e.target)) {
        el.$closePopup();
      }
    },
    $removeClickHandler: (el) => () =>
      window.document.removeEventListener('mousedown', el.$clickHandler),
    $addClickHandler: (el) => () =>
      window.document.addEventListener('mousedown', el.$clickHandler),
    $closePopup: (el) => () => {
      let context = el.$('^ax-appkit-context');
      let popup = context.$('ax-appkit-context-popup');
      if (options.menu) {
        let menu = popup.$('ax-appkit-menu');
        menu && menu.$closeSubmenus();
      }
      popup.style.display = 'none';
      el.$removeClickHandler();
      el.$send('ax.appkit.context.popup.close');
    },
    $exit: (el) => el.$removeClickHandler(),
    $init: (el) => {
      let popupContents;
      let context = el.$('^ax-appkit-context');

      if (options.menu) {
        if (ax.is.function(x.menu)) {
          popupContents = x.menu({
            menu: context.$menu(),
          });
        } else {
          popupContents = options.menu;
        }
      } else {
        popupContents = options.popup || '';
      }

      let popup = context.$('ax-appkit-context-popup');

      el.$on({
        'click: show popup': (e) => {
          let el = e.currentTarget;
          e.preventDefault();
          e.stopPropagation();
          if (x.lib.element.visible(popup)) {
            el.$closePopup();
          } else {
            popup.$nodes = [popupContents];
            // popup.style.left = `-5px`;
            // popup.style.top = `-9px`;
            popup.style.display = 'inline-block';
            nudgePopup(popup);
            el.$addClickHandler();
            el.$send('ax.appkit.context.popup.show');
          }
        },
      });
    },
    ...options.contentTag,
  };

  return a['ax-appkit-context'](
    [
      a['ax-appkit-context-content'](component, contentTagOptions),
      a['ax-appkit-context-popup'](popupTagOptions),
    ],
    contextTagOptions
  );
};

ax.css({
  'ax-appkit-context': {
    $: {
      position: 'relative',
    },
  },
  'ax-appkit-context-popup': {
    $: {
      display: 'none',
      left: '0px',
    },
  },
  'ax-appkit-menu': {
    $: {
      display: 'block',
      width: '150px',
      zIndex: 1,
    },
    'ax-appkit-menu-item': {
      $: {
        display: 'block',
        width: '100%',
        userSelect: 'none',
        position: 'relative',
      },
      'ax-appkit-menu-submenu-open': {
        $: {
          whiteSpace: 'nowrap',
          display: 'block',
          width: '125px',
          lineHeight: '1.5',
          padding: '0.375rem',
          overflowX: 'hidden',
        },
      },
      'ax-appkit-menu-submenu-open-caret': {
        $: {
          float: 'right',
          lineHeight: '1.5',
          padding: '0.375rem',
        },
      },
      'ax-appkit-menu-submenu': {
        $: {
          position: 'absolute',
          left: '150px',
          top: '0px',
          display: 'none',
        },
      },
      '&:hover': {
        $: {
          backgroundColor: 'lightgray',
        },
      },
      button: {
        $: {
          lineHeight: '1.5',
          padding: '0.375rem',
          width: '100%',
          border: '1px solid transparent',
          background: 'none',
          textAlign: 'left',
        },
      },
    },
    hr: {
      $: {
        marginTop: '0.375rem',
        marginBottom: '0.375rem',
      },
    },
    menu: {
      $: {
        margin: 0,
        padding: 0,
        backgroundColor: 'white',
        boxShadow: '0px 0px 5px gray',
      },
    },
  },
});

ax.extensions.menu.item = (item, options = {}) => {
  let component;

  if (item.menu) {
    component = [
      a['ax-appkit-menu-submenu-open-caret']('⯈'),
      a['ax-appkit-menu-submenu-open'](item.label),
      a['ax-appkit-menu-submenu'](
        x.menu({
          menu: item.menu,
        }),
        {
          $setZ: (el) => (z) => {
            el.style.zIndex = z;
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

  let openSubmenu = (el, e) => {
    e.preventDefault();
    let target = el.$('ax-appkit-menu-submenu');
    let submenus = el.$('^ax-appkit-menu').$$('ax-appkit-menu-submenu');

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
      click: (e) => {
        let el = e.currentTarget;
        if (e.target.tagName == 'APPKIT-MENU-SUBMENU-OPEN') {
          openSubmenu(el, e);
          e.stopPropagation();
        }
      },
      mouseenter: (e) => {
        let el = e.currentTarget;
        openSubmenu(el, e);
      },
      ...(options.itemTag || {}).$on,
    },
  };

  return a['ax-appkit-menu-item'](component, itemTagOptions);
};

}));
