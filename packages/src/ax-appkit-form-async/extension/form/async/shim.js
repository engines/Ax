ax.extension.form.async.shim = {
  form: (f, target) => (options = {}) =>
    ax.a['|appkit-asyncform'](
      [
        ax.a['div|appkit-asyncform-output'],
        ax.a['|appkit-asyncform-body'](
          target({
            ...options,
            formTag: {
              $controls: function () {
                return ax.x.lib.unnested(this, '|appkit-form-control');
              },
              $buttons: function () {
                return this.$$('button').$$;
              },
              $disable: function () {
                let controls = [...this.$controls(), ...this.$buttons()];
                for (let i in controls) {
                  ax.x.lib.element.visible(controls[i]) &&
                    controls[i].$disable &&
                    controls[i].$disable();
                }
              },
              $enable: function () {
                let controls = [...this.$controls(), ...this.$buttons()];
                for (let i in controls) {
                  ax.x.lib.element.visible(controls[i]) &&
                    controls[i].$enable &&
                    controls[i].$enable();
                }
              },
              ...options.formTag,
              $on: {
                'submit: async submit': (e, el) => {
                  e.preventDefault();

                  let form = el.$('^form');
                  let formData = el.$formData();

                  let submitter = el.$('[type="submit"]:focus');
                  if (submitter && submitter.name) {
                    formData.append(submitter.name, submitter.value);
                  }

                  el.$disable && el.$disable();

                  let outputEl = el.$(
                    '^|appkit-asyncform |appkit-asyncform-output'
                  );
                  let completeFn = () => {
                    el.$enable && el.$enable();
                    var windowTop = $(window).scrollTop();
                    var windowBottom = windowTop + $(window).height();
                    var outputTop = $(outputEl).offset().top;
                    var outputBottom = outputTop + $(outputEl).height();
                    if (outputBottom > windowBottom || outputTop < windowTop) {
                      outputEl.scrollIntoView();
                    }
                    el.$send('ax.appkit.form.async.complete');
                  };

                  if (ax.is.function(options.action)) {
                    let submition = {
                      formData: formData,
                      data: ax.x.lib.form.data.objectify(formData),
                      form: el,
                      output: outputEl,
                      complete: completeFn,
                      submitter: submitter,
                    };

                    options.action(submition) && completeFn();
                  } else {
                    let body;
                    // Do not send empty form data. Some web servers don't lik it.
                    if (Array.from(formData.entries()).length > 0) {
                      body = formData;
                    }

                    outputEl.$nodes = [
                      (a, x) =>
                        ax.x.http({
                          url: el.getAttribute('action'),
                          body: body,
                          method: el.getAttribute('method'),
                          when: options.when,
                          success: options.success,
                          error: options.error,
                          catch: options.catch,
                          complete: completeFn,
                        }),
                    ];
                  }
                },
                ...(options.formTag || {}).$on,
              },
            },
          })
        ),
      ],
      options.asyncformTag
    ),
};
