ax.extension.router.interface.mount = (config) => {
  return (options = {}) => {
    let a = ax.a;
    let x = ax.x;

    config.default = options.default || config.default;
    config.routes = options.routes || {};

    let init;
    let component;
    let matched;
    let transition = ax.x.router.interface.mount.transition(
      ax.is.undefined(options.transition)
        ? config.transition
        : options.transition
    );
    let view = ax.x.router.interface.mount.view;

    let lazy = ax.is.undefined(options.lazy) ? config.lazy : options.lazy;

    if (transition) {
      init = (el) => {
        let locatedView = view(config, el);
        el.$matched = locatedView.matched;
        el.$scope = locatedView.scope;
        el.$('ax-appkit-transition').$to(locatedView.component);
      };
      component = [transition];
    } else {
      component = (el) => {
        let locatedView = view(config, el);
        el.$matched = locatedView.matched;
        el.$scope = locatedView.scope;
        return locatedView.component;
      };
    }

    let mountTag = {
      id: options.id,
      $init: init,
      $nodes: component,

      $reload: (el) => () => {
        el.$matched = false;
        el.$('^ax-appkit-router').$go();
      },

      $load: (el) => (path, query, anchor) => {

        config.path = path;
        config.query = query;
        config.anchor = anchor;

        let locatedView = view(config, el);

        if (
          lazy &&
          el.$scope == locatedView.scope &&
          locatedView.matched &&
          el.$matched
        ) {
          let routes = x.lib.unnested(el, 'ax-appkit-router-mount');
          routes.forEach((r) => {
            r.$load(path, query, anchor);
          });
        } else {
          el.$scope = locatedView.scope;
          el.$matched = locatedView.matched;
          if (transition) {

            if (!el.$('ax-appkit-router-view')) debugger

            // Disable pointer events on outgoing view
            el.$('ax-appkit-router-view').style.pointerEvents = 'none';
            el.$('ax-appkit-transition').$to(locatedView.component);
          } else {
            el.$nodes = locatedView.component;
          }
        }
        el.$send('ax.appkit.router.load', {
          detail: {
            path: path,
            query: query,
            anchor: anchor,
          },
        });
      },
      ...options.mountTag,
    };

    return a['ax-appkit-router-mount'](null, mountTag);
  };
};
