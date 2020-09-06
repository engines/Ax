ax.extension.context = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let component = options.content || null;

  let popupTagOptions = {
    ...options.popupTag,
    style: {
      position: 'fixed',
      zIndex: 1,
      ...(options.popupTag || {}).style,
    },
  };

  let contextTagOptions = {
    $on: {
      click: (e, el) => {
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
        popupContents = options.popup || null;
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
        contextmenu: (e, el) => {
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

  return (a, x) =>
    a['ax-appkit-context'](
      [
        a['ax-appkit-context-content'](component, contentTagOptions),
        a['ax-appkit-context-popup'](null, popupTagOptions),
      ],
      contextTagOptions
    );
};
