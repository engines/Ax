ax.extension.form.async = (target, options = {}) =>
  ax.a['ax-appkit-asyncform'](
    [
      ax.a['ax-appkit-asyncform-output'],
      ax.a['ax-appkit-asyncform-body'](
        target({
          ...options,
          formTag: {
            $controls: (el) => () => {
              return ax.x.lib.unnested(el, 'ax-appkit-form-control');
            },
            $value: (el) => () => {
              let controls = el.$controls();
              let object = {};
              for (let control of controls) {
                object[control.$key] = control.$value();
              }
              return object;
            },
            $disable: (el) => () => {
              el.style.pointerEvents = 'none';
              let controls = el.$controls();
              for (let i in controls) {
                ax.x.lib.element.visible(controls[i]) &&
                  controls[i].$disable &&
                  controls[i].$disable();
              }
            },
            $enable: (el) => () => {
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
    {
      ...options.asyncformTag,
      $on: {
        'submit: async submit': (e, el) => {
          e.preventDefault();

          let formEl = el.$('form');
          let outputEl = el.$('ax-appkit-asyncform-output');
          let formData = formEl.$formData();

          let submitter = formEl.$('[type="submit"]:focus');
          if (submitter && submitter.name) {
            formData.append(submitter.name, submitter.value);
          }
          formEl.$disable && formEl.$disable();

          let completeFn = () => {
            formEl.$enable && formEl.$enable();
            var windowTop = window.scrollY;
            var windowBottom = windowTop + window.innerHeight;
            var outputTop = outputEl.offsetParent.offsetTop;
            var outputBottom = outputTop + outputEl.offsetHeight;
            if (outputBottom > windowBottom || outputTop < windowTop) {
              outputEl.scrollIntoView();
            }
            el.$send('ax.appkit.form.async.complete');
          };

          let submission = {
            form: formEl,
            output: outputEl,
            submitter: submitter,
            complete: completeFn,
          };

          if (ax.is.function(options.action)) {
            options.action(submission, el) && completeFn();
          } else {
            let body;
            let headers;
            // Do not send empty form data. Some web servers don't like it.
            if (Array.from(formData.entries()).length > 0) {
              if (options.encode == 'json') {
                body = ax.x.lib.form.data.stringify(formData);
                headers = {
                  'Content-Type': 'application/json',
                  ...options.headers,
                };
              } else if (options.encode == 'urlencoded') {
                body = ax.x.lib.form.data.urlencoded(formData);
                headers = {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  ...options.headers,
                };
              } else if (ax.is.function(options.encode)) {
                body = options.encode(formData);
                headers = options.headers;
              } else {
                body = formData;
                headers = options.headers;
              }
            }

            outputEl.$nodes = [
              ax.x.fetch({
                url: formEl.getAttribute('action'),
                body: body,
                method: formEl.getAttribute('method'),
                headers: headers,
                ...(options.success
                  ? {
                      success: (result, fetchEl, response) =>
                        options.success(result, el, response, {
                          ...submission,
                          fetch: fetchEl,
                        }),
                    }
                  : {}),
                when: options.when,
                error: options.error,
                catch: options.catch,
                complete: completeFn,
                ...options.fetch,
              }),
            ];
          }
        },
        ...(options.asyncformTag || {}).$on,
      },
    }
  );
