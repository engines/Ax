ax.extension.router.interface.mount = (setup) => {
  return (options = {}) => {
    let a = ax.a;
    let x = ax.x;

    let config = {
      ...setup,
      default: options.default || setup.default,
      routes: options.routes || {},
      transition: ax.is.undefined(options.transition)
        ? setup.transition
        : options.transition,
      lazy: ax.is.undefined(options.lazy) ? setup.lazy : options.lazy,
    };

    let init;
    let component;
    let matched;
    let view = ax.x.router.interface.mount.view;

    let componentWrapper = (component) =>
      a['ax-appkit-router-load'](component, {
        $init: (el) => {
          el.$send('ax.appkit.router.load');
        },
      });

    if (config.transition) {
      let transition = ax.x.router.interface.mount.transition(
        config.transition,
        {
          in: (el) => {
            el.$('^ax-appkit-router-mount').$scrollToAnchor();
          },
        }
      );
      init = (el) => {
        let locatedView = view(config, el);
        el.$matched = locatedView.matched;
        el.$scope = locatedView.scope;
        el.$('ax-appkit-transition').$to(
          componentWrapper(locatedView.component)
        );
      };
      component = [transition];
    } else {
      component = (el) => {
        let locatedView = view(config, el);
        el.$matched = locatedView.matched;
        el.$scope = locatedView.scope;
        return componentWrapper(locatedView.component);
      };
    }

    let mountTag = {
      id: options.id,
      $init: init,
      $nodes: component,

      $reload: (el) => () => {
        el.$matched = false;
        el.$('^ax-appkit-router').$pop();
      },

      $scrollToAnchor: (el) => () => {
        if (config.anchor) {
          let anchored = window.document.getElementById(config.anchor);
          if (anchored) anchored.scrollIntoView();
        }
      },

      $load: (el) => {
        console.log(el)
        return (path, query, anchor) => {
          config.path = path;
          config.query = query;
          config.anchor = anchor;

          let locatedView = view(config, el);

          if (
            config.lazy &&
            el.$matched &&
            locatedView.matched &&
            el.$scope == locatedView.scope
          ) {
            let routes = x.lib.unnested(el, 'ax-appkit-router-mount');
            routes.forEach((r) => {
              r.$load(path, query, anchor);
            });
          } else {
            el.$scope = locatedView.scope;
            el.$matched = locatedView.matched;
            let component = componentWrapper(locatedView.component);

            if (config.transition) {
              // Disable pointer events on outgoing view
              el.$('ax-appkit-router-view').style.pointerEvents = 'none';
              el.$('ax-appkit-transition').$to(component);
            } else {
              el.$nodes = component;
              el.$scrollToAnchor();
            }
          }
        }
      },
      ...options.mountTag,
    };

    return a['ax-appkit-router-mount'](null, mountTag);
  };
};
