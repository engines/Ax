ax.extensions.form.async = (target, options = {}) =>
  a['ax-appkit-asyncform']({
    $nodes: [
      a['ax-appkit-asyncform-output'],
      a['ax-appkit-asyncform-body'](
        target({
          ...options,
          formTag: {
            method: options.method,
            $controls: (el) => () =>
              ax.x.lib.unnested(
                el,
                'ax-appkit-form-control:not(.ax-appkit-form-control-without-value)'
              ),
            $output: (el) => () =>
              options.digest ? options.digest(el.$value()) : el.$value(),
            $value: (el) => () => {
              let controls = el
                .$controls()
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
      'submit: async submit': (e) => {
        let el = e.currentTarget;
        e.preventDefault();
        setTimeout(() => ax.extensions.form.async.submit(e, el, options), 0);
      },
      ...(options.asyncformTag || {}).$on,
    },
  });
