ax.extension.form.async = (target, options = {}) =>
  ax.a['ax-appkit-asyncform'](null, {
    $nodes: () => [
      ax.a['ax-appkit-asyncform-output'],
      ax.a['ax-appkit-asyncform-body'](
        target({
          ...options,
          formTag: {
            method: options.method,
            $controls: (el) => () =>
              ax.x.lib.unnested(el, 'ax-appkit-form-control'),
            $output: (el) => () =>
              options.digest ? options.digest(el.$value()) : el.$value(),
            $value: (el) => () => {
              let controls = ax.x.lib
                .unnested(
                  el,
                  'ax-appkit-form-control:not(.ax-appkit-form-control-without-value), |ax-appkit-form-nest-items'
                )
                .filter((control) => control.$enabled);
              let object = {};
              for (let control of controls) {
                object[control.$key] = control.$output();
              }
              if (options.scope) {
                let result = {};
                let keys = ax.x.lib.name.dismantle(options.scope);
                result[keys] = object;
                return result;
              } else {
                return object;
              }
            },
            $enabled: true,
            $disable: (el) => () => {
              el.$enabled = false;
              el.style.pointerEvents = 'none';
              let controls = el.$controls();
              for (let i in controls) {
                ax.x.lib.element.visible(controls[i]) &&
                  controls[i].$disable &&
                  controls[i].$disable();
              }
            },
            $enable: (el) => () => {
              el.$enabled = true;
              el.style.pointerEvents = 'unset';
              let controls = el.$controls();
              for (let i in controls) {
                ax.x.lib.element.visible(controls[i]) &&
                  controls[i].$enable &&
                  controls[i].$enable();
              }
            },
            ...options.formTag,
          },
        })
      ),
    ],
    ...options.asyncformTag,
    $on: {
      'submit: async submit': (e, el) => {
        e.preventDefault();
        setTimeout(() => ax.extension.form.async.submit(e, el, options), 0);
      },
      ...(options.asyncformTag || {}).$on,
    },
  });
