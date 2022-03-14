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
              ax.x.lib.unnested(el, 'ax-appkit-form-control:not(.ax-appkit-form-control-without-value)'),
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
      'submit: async submit': (e, el) => {
        e.preventDefault();
        setTimeout(() => ax.extensions.form.async.submit(e, el, options), 0);
      },
      ...(options.asyncformTag || {}).$on,
    },
  });

ax.extensions.form.async.shim = {
  form: (f, target) => (options = {}) => ax.x.form.async(target, options),
};

ax.extensions.form.async.submit = (e, el, options) => {
  let formEl = el.$('form');
  let outputEl = el.$('ax-appkit-asyncform-output');
  let formData = formEl.$formData();

  let submitter = formEl.$('[type="submit"]:focus');

  let completeFn = () => {
    formEl.$enable && formEl.$enable();
    var windowTop = window.scrollY;
    var windowBottom = windowTop + window.innerHeight;
    var outputTop = outputEl.offsetParent.offsetTop;
    var outputBottom = outputTop + outputEl.offsetHeight;
    if (outputBottom > windowBottom || outputTop < windowTop) {
      outputEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
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
    if (options.encode == 'json') {
      let formValue = formEl.$output();
      if (submitter && submitter.name) {
        formValue[submitter.name] = submitter.value;
      }
      body = JSON.stringify(formValue);
      headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
    } else if (options.encode == 'urlencoded') {
      if (ax.is.function(options.digest)) {
        formData = options.digest(formData);
      }
      body = ax.x.lib.form.data.urlencoded(formData);
      headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options.headers,
      };
    } else if (ax.is.function(options.encode)) {
      body = options.encode(submission);
      headers = options.headers;
    } else {
      if (submitter && submitter.name) {
        formData.append(submitter.name, submitter.value);
      }
      // Do not send empty form data. Some web servers don't like it.
      if (Array.from(formData.entries()).length > 0) {
        body = formData;
      }
      headers = options.headers;
    }

    formEl.$disable && formEl.$disable();

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
};

}));
