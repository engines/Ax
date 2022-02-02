ax.extension.popup = function (component, options = {}) {
  let a = ax.a;
  let x = ax.x;

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
      'click: close submenus': (el) => (e) => {
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
    // debugger
    // target.style.left = `${-1000}px`;
    // if (bGap < 0) target.style.top = `${bGap}px`;
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
        popupContents = options.popup || null;
      }

      let popup = context.$('ax-appkit-context-popup');

      el.$on({
        'click: show popup': (el) => (e) => {
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

  return (a, x) =>
    a['ax-appkit-context'](
      [
        a['ax-appkit-context-content'](component, contentTagOptions),
        a['ax-appkit-context-popup'](null, popupTagOptions),
      ],
      contextTagOptions
    );
};
