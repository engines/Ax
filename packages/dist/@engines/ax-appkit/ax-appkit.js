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

ax.extensions.button = function (options = {}) {
  let handler = options.onclick || (() => {});

  let label = a['ax-appkit-button-label'](options.label || '', {
    style: {
      pointerEvents: 'none',
    },
  });

  let confirmation;

  if (ax.is.string(options.confirm)) {
    confirmation = () => confirm(options.confirm);
  } else if (ax.is.function(options.confirm)) {
    confirmation = (el) => confirm(options.confirm(el));
  } else if (options.confirm) {
    confirmation = () => confirm('Are you sure?');
  } else {
    confirmation = () => true;
  }

  let buttonTag = {
    type: options.type || 'button',
    name: options.name,
    value: options.value,
    ...options.buttonTag,
    $on: {
      'click: button onclick': (e, el) => {
        confirmation(el) && handler(e, el);
      },
      ...(options.buttonTag || {}).$on,
    },
  };

  return a.button(label, buttonTag);
};

ax.extensions.check = function (options = {}) {
  let inputId =
    x.lib.object.dig(options, ['inputTag', 'id']) || x.lib.uuid.generate();

  let checkedValue = options.checked || 'on';

  let inputTagOptions = {
    type: options.type || 'checkbox',
    name: options.name,
    value: checkedValue,
    required: options.required,
    onclick: options.readonly ? 'return false' : 'return true',
    checked: options.value == checkedValue ? 'checked' : undefined,
    ...options.inputTag,
    id: inputId,
  };

  let labelTagOptions = {
    $nodes: [options.label || ''],
    for: inputId,
    ...options.labelTag,
  };

  return a['ax-appkit-check'](
    [
      a.input(inputTagOptions),
      a.label(labelTagOptions),
    ],
    options.checkTag || {}
  );
};

ax.extensions.cycle = function (options = {}) {
  let period = options.period || 500;
  let collection = options.collection || '⣯⣟⡿⢿⣻⣽⣾⣷';

  let max = collection.length - 1;

  let cycleTag = {
    $count: 0,
    $nodes: (el) => collection[el.$count],
    $init: (el) => {
      setInterval(() => {
        if (el.$count === max) {
          el.$count = 0;
        } else {
          el.$count++;
        }
        el.$render();
      }, period);
    },
    ...options.cycleTag,
  };

  return a['ax-appkit-cycle'](cycleTag);
};

ax.extensions.fetch = (options = {}) => new ax.AxAppkitFetch(options).render();

ax.extensions.form = function (options = {}) {
  let f = this.form.factory({
    scope: options.scope,
    object: options.object,
    formOptions: options,
  });

  return f.form(options);
};

ax.extensions.out = function (value, options = {}) {
  let outTag = options.outTag || {}
  let component;

  if (ax.is.undefined(value)) {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  } else {
    if (options.parse) {
      if (ax.is.string(value)) {
        try {
          component = x.out.element(JSON.parse(value));
        } catch (error) {
          component = a['.error'](`⚠ ${error.message}`);
        }
      } else {
        component = a['.error'](`⚠ Not a string.`);
      }
    } else {
      component = x.out.element(value);
    }
  }

  return a['ax-appkit-out'](component, outTag);
};

ax.extensions.report = function (options = {}) {
  let r = this.report.factory({
    scope: options.scope,
    object: options.object,
    reportOptions: options,
  });

  return r.report(options);
};

ax.extensions.router = (options = {}) => {
  if (options.home) {
    if (window.location.pathname.match(/^$|^\/$/)) {
      window.history.replaceState({}, 'Home', options.home);
    }
  }

  return ax.x.router.element(options);
};

ax.extensions.time = function (options = {}) {
  return a.time({
    $init: (el) => setInterval(el.$render, 1000),
    $text: () => new Date().toLocaleTimeString(),
    ...options.timeTag,
  });
};

ax.extensions.transition = {};

ax.AxAppkitFetch = class {
  constructor(options = {}) {
    this.fetchCount = this.determineFetchCount(options);
    this.multiple = this.isMultiple(options);
    this.url = options.url;
    this.method = options.method;
    this.query = options.query;
    this.headers = options.headers;
    this.body = options.body;
    this.placeholder = options.placeholder || '';
    this.fetchTag = options.fetchTag || {};
    this.preprocessWhen = options.when || {};
    this.successCallback = options.success;
    this.errorCallback = options.error;
    this.catchCallback = options.catch;
    this.completeCallback = options.complete;
  }

  determineFetchCount(options) {
    return Math.max(
      ...['url', 'method', 'query', 'method', 'headers', 'body'].map((key) =>
        ax.is.array(options[key]) ? options[key].length : 0
      )
    );
  }

  isMultiple(options) {
    return ['url', 'method', 'query', 'method', 'headers', 'body'].some((key) =>
      ax.is.array(options[key])
    );
  }

  render() {
    return a['ax-appkit-fetch'](this.placeholder, {
      $init: (el) => {
        this.element = el;
        this.init();
      },
      ...this.fetchTag,
    });
  }

  init() {
    // No fetches when url is empty array.
    if (this.multiple && this.fetchCount == 0) {
      this.renderSuccessResult([]);
      this.callComplete();
      return;
    }
    this.performFetches()
      .then((responses) => this.buildResults(responses))
      .then((results) => this.preprocessResults(results))
      .then((results) => this.renderResults(results))
      .catch((error) => this.renderCatch(error))
      .finally(() => this.callComplete());
  }

  performFetches() {
    return Promise.all(
      [...Array(this.fetchCount || 1)].map((_, i) => {
        let url = this.propertyFor('url', i);
        let query = this.propertyFor('query', i);
        if (query) url = `${url}?${x.lib.query.stringify(query)}`;
        return this.fetchPromise(url, i);
      })
    );
  }

  fetchPromise(url, i) {
    return fetch(url, {
      method: this.propertyFor('method', i),
      headers: this.propertyFor('headers', i),
      body: this.propertyFor('body', i),
      ...this.propertyFor('fetch', i),
    });
  }

  propertyFor(key, i) {
    return ax.is.array(this[key]) ? this[key][i] : this[key];
  }

  buildResults(responses) {
    return Promise.all(
      responses.map(
        (response) =>
          new Promise((resolve, reject) => {
            let contentType = this.contentTypeFor(response);
            this.contentPromise(response, contentType).then((body) =>
              resolve({
                body: body,
                response: response,
                status: response.status,
                contentType: contentType,
                error: response.status < 200 || response.status >= 300,
              })
            );
          })
      )
    );
  }

  contentTypeFor(response) {
    return (response.headers.get('content-type') || '').split(';')[0];
  }

  contentPromise(response, contentType) {
    return contentType == 'application/json'
      ? response.json()
      : response.text();
  }

  preprocessResults(results) {
    return new Promise((resolve, reject) => {
      resolve(this.applyPreprocessors(results));
    });
  }

  applyPreprocessors(results) {
    return results.map((result) => {
      let body = result.body;
      let response = result.response;
      let status = result.status;
      let contentType = result.contentType;
      if (this.preprocessWhen[status])
        body = this.preprocessWhen[status](body, this.element, response);
      if (this.preprocessWhen[contentType])
        body = this.preprocessWhen[contentType](body, this.element, response);
      result.body = body;
      return result;
    });
  }

  renderResults(results) {
    results.filter((result) => result.error).length
      ? this.renderErrorResult(results)
      : this.renderSuccessResult(results);
  }

  renderErrorResult(results) {
    results = results.filter((result) => result.error);
    let bodies = results.map((result) => result.body);
    let responses = results.map((result) => result.response);
    if (this.errorCallback) {
      let body = this.multiple ? bodies : bodies[0];
      let response = this.multiple ? responses : responses[0];
      let node = this.errorCallback(body, this.element, response);
      this.element.$nodes = [node];
    } else {
      this.element.$nodes = [a['ax-appkit-fetch-response.error'](bodies)];
    }
  }

  renderSuccessResult(results) {
    let bodies = results.map((result) => result.body);
    let responses = results.map((result) => result.response);
    let body = this.multiple ? bodies : bodies[0];
    if (this.successCallback) {
      let response = this.multiple ? responses : responses[0];
      try {
        let node = this.successCallback(body, this.element, response);
        this.element.$nodes = [node];
      } catch (err) {
        console.error(err);
        this.element.$nodes = [];
      }
    } else {
      this.element.$nodes = [
        a['ax-appkit-fetch-response.success'](
          a.pre(JSON.stringify(body, null, 2))
        )
      ];
    }
  }

  renderCatch(error) {
    console.error(error);
    if (this.catchCallback) {
      let node = this.catchCallback(error, this.element);
      this.element.$nodes = [node];
    } else {
      this.element.$nodes = [a['ax-appkit-fetch-response.error'](
        a.pre(error.message)
      )];
    }
  }

  callComplete() {
    if (this.completeCallback) this.completeCallback(this.element);
  }
};

ax.extensions.form.factory = function (options) {
  let shims = [this.shim, ...(options.formOptions.shims || [])];

  return new (function () {
    let proxy = function (factory, base = {}, shim = {}) {
      return new Proxy(base, {
        get: (target, property) => {
          let object = target[property];
          if (ax.is.function(shim[property])) {
            return shim[property](factory.target, object);
          } else if (ax.is.object(shim[property])) {
            return proxy(factory, object, shim[property]);
          } else {
            return object;
          }
        },
      });
    };

    this.target = options;

    for (let i in shims) {
      this.target = proxy(this, this.target, shims[i]);
    }

    return this.target;
  })();
};

ax.extensions.form.shim = {
  form: (f) => (options) => ax.x.form.factory.form(f, options),
  input: (f) => (options) => ax.x.form.factory.input(options),
  select: (f) => (options) => ax.x.form.factory.select(options),
  textarea: (f) => (options) => ax.x.form.factory.textarea(options),
  checkbox: (f) => (options) => ax.x.form.factory.checkbox(options),
  checkboxes: (f) => (options) => ax.x.form.factory.checkboxes(options),
  radios: (f) => (options) => ax.x.form.factory.radios(options),
  button: (f) => (options) => ax.x.form.factory.button(options),
  submit: (f) => (options) => ax.x.form.factory.submit(f, options),
  cancel: (f) => (options) => ax.x.form.factory.cancel(f, options),
};

ax.extensions.lib.animate = {};

ax.extensions.lib.array = {};

ax.extensions.lib.coerce = {};

ax.extensions.lib.compact = function (value) {
  let compact = ax.x.lib.compact;

  if (ax.is.array(value)) {
    return compact.array(value);
  } else if (ax.is.object(value)) {
    return compact.object(value);
  } else if (['', undefined, null].includes(value)) {
    return '';
  } else {
    return value;
  }
};

ax.extensions.lib.element = {};

ax.extensions.lib.form = {};

ax.extensions.lib.name = {};

ax.extensions.lib.object = {};

ax.extensions.lib.query = {};

ax.extensions.lib.tabable = function (element) {
  if (element.tabIndex >= 0 && ax.x.lib.element.visible(element)) {
    return true;
  } else {
    return false;
  }
};

ax.extensions.lib.text = {};

ax.extensions.lib.unnested = function (el, tag) {
  let controls = el.$$(tag).$$;
  let result = [];

  controls.forEach(function (el1, i) {
    let nested;
    controls.forEach(function (el2) {
      if (!el1.isSameNode(el2) && el2.contains(el1)) {
        nested = true;
      }
    });
    if (!nested) {
      result.push(el1);
    }
  });

  return result;
};

ax.extensions.lib.uuid = {};

ax.extensions.out.element = function (value) {
  if (ax.is.array(value)) {
    return a['ax-appkit-out-collection'](
      a.ol(value.map((element) => a.li(x.out.element(element))))
    );
  } else if (ax.is.null(value)) {
    return a['ax-appkit-out-null'](null);
  } else if (ax.is.undefined(value)) {
    return a['ax-appkit-out-undefined'](a.i('UNDEFINED'));
  } else if (ax.is.function(value)) {
    return a['ax-appkit-out-function'](`𝑓 ${value}`);
  } else if (ax.is.object(value)) {
    return a['ax-appkit-out-object'](
      a.ul(
        Object.keys(value).map((key) => {
          return a.li([a.label(key), ' ', x.out.element(value[key])]);
        })
      )
    );
  } else if (ax.is.number(value)) {
    return a['ax-appkit-out-number'](value);
  } else if (ax.is.boolean(value)) {
    return a['ax-appkit-out-boolean'](value);
  } else {
    return a['ax-appkit-out-text'](value);
  }
};

ax.extensions.report.factory = function (options) {
  let shims = [this.shim, ...(options.reportOptions.shims || [])];

  return new (function () {
    let proxy = function (factory, base = {}, shim = {}) {
      return new Proxy(base, {
        get: (target, property) => {
          let object = target[property];
          if (ax.is.function(shim[property])) {
            return shim[property](factory.target, object);
          } else if (ax.is.object(shim[property])) {
            return proxy(factory, object, shim[property]);
          } else {
            return object;
          }
        },
      });
    };

    this.target = options;

    for (let i in shims) {
      this.target = proxy(this, this.target, shims[i]);
    }

    return this.target;
  })();
};

ax.extensions.report.shim = {
  report: (r) => (options) => ax.x.report.factory.report(r, options),
  button: (r) => (options) => ax.x.report.factory.button(options),
  checkbox: (r) => (options) => ax.x.report.factory.checkbox(options),
  checkboxes: (r) => (options) => ax.x.report.factory.checkboxes(options),
  output: (r) => (options) => ax.x.report.factory.output(options),
  radios: (r) => (options) => ax.x.report.factory.radios(options),
  select: (r) => (options) => ax.x.report.factory.select(options),
  string: (r) => (options) => ax.x.report.factory.string(options),
  text: (r) => (options) => ax.x.report.factory.text(options),
};

ax.extensions.router.element = (options) => {
  let routerTag = {
    id: options.id,
    $init: ax.extensions.router.element.init(options),
    $pop: ax.extensions.router.element.pop,
    $open: ax.extensions.router.element.open(options),
    $locate: ax.extensions.router.element.locate,
    $location: ax.extensions.router.element.location,
    $load: ax.extensions.router.element.load,
    ...options.routerTag,
  };

  return a['ax-appkit-router'](routerTag);
};

ax.extensions.router.interface = (config) => {
  let result = {};
  result.path = config.path;
  result.query = config.query;
  result.anchor = config.anchor;
  result.scope = config.scope;
  result.match = config.match;
  result.splats = config.splats;
  result.slash = config.slash;
  result.params = {
    ...config.match,
    ...config.query,
  };
  
  result.load = ax.x.router.interface.load(config);
  result.open = ax.x.router.interface.open(config);

  result.mount = ax.x.router.interface.routes(config);

  return result;
};

ax.extensions.transition.fade = function (options = {}) {
  let duration = (options.duration || 500) / 2;
  return a['ax-appkit-transition']({
    $init: (el) => {

      el.style.display = 'none';
      if (options.initial) {
        el.$in(options.initial);
      }
    },
    $in: (el) => (component) => {
      // Show el before inserting content. For any $init functions
      // that rely on visible elements, such as resizing functions that
      // need to access el height/width.
      el.style.display = options.display || 'block';
      el.$nodes = [component];
      x.lib.animate.fade.in(el, {
        duration: duration,
        display: options.display,
        complete: () => {
          el.$send('ax-appkit-transition-complete');
          if (options.complete) options.complete(el);
        },
      });
      el.$send('ax-appkit-transition-in');
      if (options.in) options.in(el);
    },
    $to: (el) => (component) => {
      if (el.style.opacity == '1') {
        x.lib.animate.fade.out(el, {
          duration: duration,
          complete: () => el.$in(component),
        });
        el.$send('ax-appkit-transition-out');
      } else {
        el.$in(component);
      }
    },
    id: options.id,
    ...options.transitionTag,
  });
};

ax.extensions.form.factory.button = function (options = {}) {
  return x.button(options);
};

ax.extensions.form.factory.cancel = (f, options = {}) => {
  let label = options.label || '✖️ Cancel';

  let onclick =
    options.onclick ||
    (() =>
      console.warn('Form cancel button does not have an onclick handler.'));

  let buttonOptions = {
    label: label,
    name: options.name,
    value: options.value,
    onclick: onclick,
    title: options.title,
    class: options.class,
    buttonTag: options.buttonTag,
    ...options.button,
  };

  return f.button(buttonOptions);
};

ax.extensions.form.factory.checkbox = function (options = {}) {
  return a['ax-appkit-form-checkbox'](
    x.check({
      name: options.name,
      value: options.value,
      type: options.type,
      label: options.label,
      checked: options.checked,
      required: options.required,
      readonly: options.readonly,
      inputTag: options.inputTag,
      labelTag: options.labelTag,
      checkTag: options.checkTag,
    }),
    options.checkboxTag || {}
  );
};

ax.extensions.form.factory.checkboxes = function (options = {}) {
  let value = x.lib.form.collection.value(options.value);
  let selections = x.lib.form.selections(options.selections);

  return a['ax-appkit-form-checkboxes'](
    selections.map((selection) => {
      let label = selection.label;

      if (selection.disabled == 'hr') {
        label = '—————';
      } else if (selection.disabled == 'br') {
        label = '';
      }

      return x.check({
        name: `${options.name}[]`,
        value: value.includes(selection.value) ? selection.value : '',
        label: label,
        checked: selection.value,
        readonly: options.readonly,
        inputTag: {
          ...(options.disabled || selection.disabled
            ? {
                disabled: 'disabled',
              }
            : {}),
          ...options.inputTag,
        },
        labelTag: options.labelTag,
        checkTag: options.checkTag,
      });
    }),
    options.checkboxesTag || {}
  );
};

ax.extensions.form.factory.form = (f, options = {}) => {
  let form = options.form || (() => '');

  let formTag = {
    id: options.id,
    method: options.method || 'POST',
    action: options.url || options.action,
    $formData: (el) => () => {
      return new FormData(el);
    },
    ...options.formTag,
  };

  return a.form(form(f), formTag);
};

ax.extensions.form.factory.input = function (options = {}) {
  let datalist = '';
  let datalistId;

  if (options.datalist) {
    datalistId = x.lib.uuid.generate();
    datalist = a.datalist(
      options.datalist.map((item) =>
        a.option({
          value: item,
        })
      ),
      {
        id: datalistId,
      }
    );
  }

  let inputTagOptions = {
    name: options.name,
    value: options.value,
    type: options.type,
    required: options.required,
    disabled: options.disabled,
    readonly: options.readonly,
    pattern: options.pattern,
    minlength: options.minlength,
    maxlength: options.maxlength,
    min: options.min,
    max: options.max,
    step: options.step,
    placeholder: options.placeholder,
    autocomplete: options.autocomplete,
    multiple: options.multiple,
    list: datalistId,
    ...options.inputTag,
  };

  return a['ax-appkit-form-input-wrapper'](
    [a.input(inputTagOptions), datalist],
    options.wrapperTag || {}
  );
};

ax.extensions.form.factory.radios = function (options = {}) {
  let value = options.value || '';

  let selections = x.lib.form.selections(options.selections);

  return a['ax-appkit-form-radios'](
    selections.map((selection) => {
      let label = selection.label;

      if (selection.disabled == 'hr') {
        label = '—————';
      } else if (selection.disabled == 'br') {
        label = '';
      }

      return x.check({
        type: 'radio',
        name: options.name,
        value: value,
        label: label,
        checked: selection.value,
        required: options.required,
        readonly: options.readonly,
        inputTag: {
          ...(options.disabled || selection.disabled
            ? {
                disabled: 'disabled',
              }
            : {}),
          ...options.inputTag,
        },
        labelTag: options.labelTag,
        checkTag: options.checkTag,
      });
    }),
    options.radiosTag || {}
  );
};

ax.extensions.form.factory.select = function (options = {}) {
  let applyPlaceholder = (el) => {
    let selected = el.$$('option')[el.selectedIndex];
    if (selected.classList.contains('placeholder')) {
      el.classList.add('placeholder');
    } else {
      el.classList.remove('placeholder');
    }
  };

  let selectTagOptions = {
    name: options.name,
    value: options.value,
    required: options.required,
    readonly: options.readonly,
    multiple: options.multiple,
    ...options.selectTag,
    $init: (el) => applyPlaceholder(el),
    $on: {
      'change: update placeholder styling': (e, el) => applyPlaceholder(el),
      ...(options.selectTag || {}).$on,
    },
  };

  return a['ax-appkit-form-select-wrapper'](
    a.select(this.select.options(options), selectTagOptions),
    options.wrapperTag || {}
  );
};

ax.extensions.form.factory.submit = (f, options = {}) => {
  let label = options.label === false ? '' : options.label || '✔ Submit';

  let buttonOptions = {
    label: label,
    type: 'submit',
    name: options.name,
    value: options.value,
    onclick: options.onclick,
    title: options.title,
    class: options.class,
    buttonTag: options.buttonTag,
    ...options.button,
  };

  return f.button(buttonOptions);
};

ax.extensions.form.factory.textarea = function (options = {}) {
  let value = options.value || '';

  let textareaTagOptions = {
    name: options.name,
    required: options.required,
    readonly: options.readonly,
    placeholder: options.placeholder,
    ...options.textareaTag,
  };

  return a['ax-appkit-form-textarea-wrapper'](
    a.textarea(value, textareaTagOptions),
    options.wrapperTag || {}
  );
};

ax.extensions.lib.animate.fade = {};

ax.extensions.lib.coerce.boolean = function (value) {
  value = value || false;
  let string = value.toString().toLowerCase();
  return value && string !== 'false' && string !== 'off' && string !== '0';
};

ax.extensions.lib.coerce.number = function (value) {
  return Number(value) || 0;
};

ax.extensions.lib.coerce.string = function (value) {
  return ax.is.undefined(value) ? '' : String(value);
};

ax.extensions.lib.compact.array = function (array) {
  return array.map((value) => this(value)).filter((value) => value != null);
};

ax.extensions.lib.compact.object = function (object) {
  for (const key in object) {
    object[key] = this(object[key]);
    if (
      object[key] === null ||
      (ax.is.object(object[key]) && Object.keys(object[key]).length === 0) ||
      (ax.is.array(object[key]) && object[key].length === 0)
    )
      delete object[key];
  }

  return object;
};

ax.extensions.lib.element.visible = function (element) {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
};

ax.extensions.lib.form.collection = {};

ax.extensions.lib.form.data = {};

ax.extensions.lib.form.selections = function (selections) {
  if (ax.is.array(selections)) {
    selections = selections.map(function (selection) {
      if (ax.is.array(selection)) {
        return {
          value: selection[0],
          label: selection[1],
          disabled: selection[2],
        };
      } else if (ax.is.object(selection)) {
        return {
          value: selection.value,
          label: selection.label,
          disabled: selection.disabled,
        };
      } else {
        return {
          value: selection,
          label: selection,
        };
      }
    });
  } else {
    selections = Object.keys(selections || {}).map(function (key) {
      let label = selections[key];
      return {
        value: key,
        label: label,
      };
    });
  }

  return selections;
};

ax.extensions.lib.name.dismantle = (string) =>
  (string.match(/\w+|\[\w*\]|\[\.\.\]/g) || []).map((part) =>
    part.replace(/\[|\]/g, '')
  );

ax.extensions.lib.object.assign = function (object, keys, value) {
  if (keys.length) {
    let key = keys.shift();
    object[key] = this.assign(object[key] || {}, keys, value);
    return object;
  } else {
    return value;
  }
};

ax.extensions.lib.object.dig = function (
  object,
  keys = [],
  defaultValue = undefined
) {
  let result = object;

  for (let key in keys) {
    if (result == undefined) {
      return defaultValue;
    } else {
      result = result[keys[key]] || undefined;
    }
  }

  return result || defaultValue;
};

ax.extensions.lib.object.omit = function (obj, keys) {
  return Object.keys(obj)
    .filter((key) => keys.indexOf(key) < 0)
    .reduce((result, key) => ((result[key] = obj[key]), result));
};

ax.extensions.lib.object.pick = function (obj, keys) {
  return keys
    .filter((key) => key in obj)
    .reduce((result, key) => ((result[key] = obj[key]), result));
};

ax.extensions.lib.query.parse = function (queryString) {
  var result = {};

  if (queryString) {
    queryString.split('&').map(function (pair) {
      pair = pair.split('=');
      let keys = x.lib.name.dismantle(decodeURIComponent(pair[0]));
      x.lib.object.assign(result, keys, decodeURIComponent(pair[1]));
    });
  }

  return result;
};

ax.extensions.lib.query.stringify = function (object, options = {}) {
  let queryString = [];
  let property;

  for (property in object) {
    if (object.hasOwnProperty(property)) {
      let k = options.prefix ? options.prefix + '[' + property + ']' : property,
        v = object[property];
      queryString.push(
        v !== null && ax.is.object(v)
          ? this.stringify(v, {
              prefix: k,
            })
          : `${k}=${encodeURIComponent(v)}`
      );
    }
  }
  return queryString.join('&');
};

ax.extensions.lib.tabable.next = function (element) {
  let elements = Array.from(window.document.querySelectorAll('*'));

  // start search at last child node
  element = Array.from(element.querySelectorAll('*')).slice(-1)[0] || element;

  let index = elements.indexOf(element);
  let count = elements.length;
  let target;
  let tabable;

  let i = index;
  do {
    i++;
    if (i === count) i = 0;
    if (i === index) return element;
    target = elements[i];
    tabable = this(target);
  } while (!tabable);

  return target;
};

ax.extensions.lib.tabable.previous = function (element) {
  let elements = Array.from(window.document.querySelectorAll('*'));

  let index = elements.indexOf(element);
  let count = elements.length;
  let target;
  let tabable;

  let i = index;
  do {
    i--;
    if (i === 0) i = count - 1;
    if (i === index) return element;
    target = elements[i];
    tabable = this(target);
  } while (!tabable);

  return target;
};

ax.extensions.lib.text.capitalize = function (string = '') {
  return string.toString().charAt(0).toUpperCase() + string.slice(1);
};

ax.extensions.lib.text.humanize = function (string = '') {
  return string.toString().replace(/_/g, ' ');
};

ax.extensions.lib.text.labelize = function (string = '') {
  return this.capitalize(this.humanize(string));
};

ax.extensions.lib.uuid.generate = function () {
  return '00000000-0000-4000-0000-000000000000'.replace(/0/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

ax.extensions.report.factory.button = function (options = {}) {
  return x.button(options);
};

ax.extensions.report.factory.checkbox = function (options = {}) {
  return a['ax-appkit-report-checkbox'](
    x.check({
      ...options,
      inputTag: {
        tabindex: -1,
        disabled: 'disabled',
        ...options.inputTag,
      },
      ...options.checkbox,
      readonly: 'readonly',
    }),
    {
      tabindex: 0,
      ...options.checkboxTag,
    }
  );
};

ax.extensions.report.factory.checkboxes = function (options = {}) {
  let value = x.lib.form.collection.value(options.value);
  let selections = x.lib.form.selections(options.selections);

  return a['ax-appkit-report-checkboxes'](
    selections.map((selection) => {
      let label = selection.label;

      if (selection.disabled == 'hr') {
        label = '—————';
      } else if (selection.disabled == 'br') {
        label = '';
      }

      return x.check({
        ...options,
        name: `${options.name}[]`,
        value: value.includes(selection.value) ? selection.value : '',
        label: label,
        checked: selection.value,
        readonly: 'readonly',
        inputTag: {
          tabindex: -1,
          disabled: 'disabled',
          ...options.inputTag,
        },
      });
    }),
    {
      tabindex: 0,
      ...options.checkboxesTag,
    }
  );
};

ax.extensions.report.factory.output = function (options = {}) {
  return a['ax-appkit-report-output'](
    x.out(options.value, {
      parse: options.parse,
      out: options.out,
    }),
    {
      tabindex: 0,
      ...options.outputTag,
    }
  );
};

ax.extensions.report.factory.radios = function (options = {}) {
  let value = options.value || '';

  let selections = x.lib.form.selections(options.selections);

  return a['ax-appkit-report-radios'](
    selections.map((selection) => {
      let label = selection.label;

      if (selection.disabled == 'hr') {
        label = '—————';
      } else if (selection.disabled == 'br') {
        label = '';
      }

      return x.check({
        type: 'radio',
        name: options.name,
        value: value == selection.value ? selection.value : '',
        label: label,
        checked: selection.value,
        tabindex: -1,
        readonly: 'readonly',
        inputTag: {
          tabindex: -1,
          disabled: 'disabled',
          ...options.inputTag,
        },
        labelTag: options.labelTag,
        checkTag: options.checkTag,
      });
    }),
    {
      tabindex: 0,
      ...options.radiosTag,
    }
  );
};

ax.extensions.report.factory.report = (r, options = {}) => {
  let report = options.report || (() => '');

  let reportTagOptions = {
    ...options.reportTag,
  };

  return a['ax-appkit-report'](report(r), reportTagOptions);
};

ax.extensions.report.factory.select = function (options = {}) {
  let value = x.lib.form.collection.value(options.value);
  let selections = x.lib.form.selections(options.selections || {});

  let labels = [];

  if (ax.is.not.array(value)) {
    value = [value];
  }

  for (let selected of value) {
    let found = selections.find((selection) => selection.value === selected);
    if (found) {
      labels.push(found.label);
    } else {
      labels.push(selected);
    }
  }
  labels = labels.join(', ');

  let selectTagOptions = {
    name: options.name,
    ...options.selectTag,
  };

  if (!labels) {
    labels = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  return a['ax-appkit-report-select'](labels, {
    tabindex: 0,
    ...selectTagOptions,
  });
};

ax.extensions.report.factory.string = function (options = {}) {
  let value = options.value || '';

  let component;

  if (options.value) {
    component = options.value.toString();
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  return a['ax-appkit-report-string'](component, {
    tabindex: 0,
    ...options.stringTag,
  });
};

ax.extensions.report.factory.text = function (options = {}) {
  let component;

  if (options.value) {
    component = options.value;
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  return a['ax-appkit-report-text'](
    a.textarea(component, {
      readonly: true,
      ...options.textareaTag,
    }),
    options.textTag || {}
  );
};

ax.extensions.router.element.init = (options) => (el) => {
  window.addEventListener('popstate', el.$pop);
  el.$nodes = ax.extensions.router.element.nodes(options)
};

ax.extensions.router.element.load = (el) => (path, query, anchor) => {
  let mounted = x.lib.unnested(el, 'ax-appkit-router-routes');
  mounted.forEach((r) => {
    r.$load(path, query, anchor);
  });
};

ax.extensions.router.element.locate = (el) => (path, query, anchor) => {
  path = path || '/';

  query = x.lib.query.stringify(query);
  path =
    (path || '/') + (query ? '?' + query : '') + (anchor ? '#' + anchor : '');

  history.pushState(
    {
      urlPath: path,
    },
    '',
    path
  );
  let event = new PopStateEvent('popstate', {
    urlPath: path,
  });
  dispatchEvent(event);
};

ax.extensions.router.element.location = (el) => () => {
  let location = window.location;

  return {
    path: location.pathname,
    query: x.lib.query.parse(location.search.slice(1)),
    anchor: location.hash.slice(1),
  };
};

ax.extensions.router.element.nodes = (options) => (el) => {
  let location = el.$location();

  let config = {
    path: location.path,
    query: location.query,
    anchor: location.anchor,
    scope: '',
    default: options.default,
    home: options.home,
    lazy: options.lazy,
    transition: options.transition,
    router: el,
    mounts: [],
  };

  let routes = options.routes || {};

  let route = x.router.interface(config);

  if (options.scope) {
    let scopeRoutes = {}
    scopeRoutes[options.scope] = (route) => {
      if (ax.is.function(routes)) {
        return routes(route);
      } else {
        return route.mount({ routes: routes });
      }
    }
    scopeRoutes['*'] = ''
    return route.mount({ routes: scopeRoutes })
  } else {
    if (ax.is.function(routes)) {
      return routes(route);
    } else {
      return route.mount({ routes: routes });
    }
  }

};

ax.extensions.router.element.open = (options) => (el) => (
  path,
  query,
  anchor
) => {
  if (path[0] != '/') {
    path = options.scope + (path ? `/${path}` : '');
  }
  
  el.$locate(path, query, anchor);
};

ax.extensions.router.element.pop = (el) => () => {
  let location = el.$location();
  el.$load(location.path, location.query, location.anchor);
  el.$send('ax.appkit.router.pop');
};

ax.extensions.router.interface.load = (config) =>
  function (locator = '', query = {}, anchor) {
    let path = window.location.pathname;

    if (locator) {
      if (locator[0] == '/') {
        path = locator;
      } else {
        if (path.match(/\/$/)) {
          path = `${path}${locator}`;
        } else {
          path = `${path}/${locator}`;
        }
      }
    }

    config.router.$load(path, query, anchor);
  };

ax.extensions.router.interface.open = (config) => (
  locator = '',
  query = {},
  anchor
) => {
  let path = window.location.pathname;

  if (locator[0] == '/') {
    path = locator;
  } else if (locator) {
    if (path.match(/\/$/)) {
      path = `${path}${locator}`;
    } else {
      path = `${path}/${locator}`;
    }
  }
  config.router.$open(path, query, anchor);
};

ax.extensions.router.interface.routes = (setup) => {
  return (options = {}) => {
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
    let view = ax.x.router.interface.routes.view;

    let componentWrapper = (component) =>
      a['ax-appkit-router-load'](component, {
        $init: (el) => {
          el.$send('ax.appkit.router.load');
        },
      });

    if (config.transition) {
      let transition = ax.x.router.interface.routes.transition(
        config.transition,
        {
          in: (el) => {
            el.$('^ax-appkit-router-routes').$scrollToAnchor();
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

    let routesTag = {
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
            let routes = x.lib.unnested(el, 'ax-appkit-router-routes');
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
        };
      },
      ...options.routesTag,
    };

    return a['ax-appkit-router-routes'](routesTag);
  };
};

ax.extensions.form.factory.select.options = function (options) {
  let selections = x.lib.form.selections(options.selections);

  if (options.placeholder) {
    selections.unshift({
      value: '',
      label: options.placeholder,
      class: 'placeholder',
    });
  }

  return selections.map(function (selection) {
    let optionsTagOptions = {
      ...options.optionTag,
      ...selection.optionTag,
    };

    if (selection.disabled == 'hr') {
      return a.option('—————', {
        value: selection.value,
        disabled: 'disabled',
        ...optionsTagOptions,
      });
    } else if (selection.disabled == 'br') {
      return a.option('', {
        value: selection.value,
        disabled: 'disabled',
        ...optionsTagOptions,
      });
    } else {
      let value = options.value;
      let selected;

      if (ax.is.array(value)) {
        selected = value.some(function (value) {
          return value == selection.value;
        });
      } else {
        selected = value == selection.value;
      }

      return a.option(selection.label, {
        value: selection.value,
        selected: selected || undefined,
        disabled: selection.disabled,
        class: selection.class,
        ...optionsTagOptions,
      });
    }
  });
};

ax.extensions.lib.animate.fade.in = function (el, options = {}) {
  let duration = options.duration || 250;
  el.style.transition = `opacity 0ms`;
  el.style.opacity = 0;
  setTimeout(() => {
    el.style.display = options.display || 'block';
    el.style.transition = `opacity ${duration}ms linear`;
    setTimeout(() => {
      el.style.opacity = 1;
      let complete = () => {
        if (options.complete) options.complete(el);
      };
      setTimeout(complete, duration);
    }, 10);
  }, 10);
};

ax.extensions.lib.animate.fade.out = function (el, options = {}) {
  let duration = options.duration || 250;
  el.style.transition = `opacity 0ms`;
  el.style.opacity = 1;
  setTimeout(() => {
    el.style.transition = `opacity ${duration}ms linear`;
    setTimeout(() => {
      el.style.opacity = 0;
      let complete = () => {
        el.style.display = 'none';
        if (options.complete) options.complete(el);
      };
      setTimeout(complete, duration);
    }, 10);
  }, 10);
};

ax.extensions.lib.animate.fade.toggle = function (el, options = {}) {
  if (el.style.display === 'none') {
    this.in(el, options);
  } else {
    this.out(el, options);
  }
};

ax.extensions.lib.form.collection.value = function (value) {
  if (ax.is.array(value)) {
    return value;
  } else if (value) {
    return [value];
  } else {
    return [];
  }
};

ax.extensions.lib.form.data.objectify = function (data) {
  let object = {};

  for (var pair of data.entries()) {
    x.lib.object.assign(object, x.lib.name.dismantle(pair[0]), pair[1]);
  }

  return object;
};

ax.extensions.lib.form.data.stringify = function (data) {
  return JSON.stringify(x.lib.form.data.objectify(data));
};

ax.extensions.lib.form.data.urlencoded = function (data) {
  let parts = [];

  for (var pair of data.entries()) {
    parts.push(`${pair[0]}=${pair[1]}`);
  }

  return parts.join('&');
};

ax.extensions.router.interface.routes.transition = (
  transition,
  options = {}
) => {
  if (ax.is.string(transition)) {
    return ax.x.transition[transition](options);
  } else if (ax.is.array(transition)) {
    let name = transition[0];
    let mergedOptions = { ...transition[1], ...options };
    return ax.x.transition[name](mergedOptions);
  } else if (ax.is.function(transition)) {
    return transition(options);
  } else {
    return transition;
  }
};

ax.extensions.router.interface.routes.view = (config, mountElement) => {
  let scope = config.scope || '';
  let scopedpath = config.path.slice(scope.length);
  let match = config.match || {};
  let splats = config.splats || [];
  let lazy = config.lazy;
  let defaultContent = config.default;
  let transition = config.transition;
  let component;
  let slash;
  let matched;

  let routesKeys = Object.keys(config.routes);

  for (let i in routesKeys) {
    let routesKey = routesKeys[i];

    for (let key of routesKey.split(',')) {
      matched = ax.x.router.interface.routes.view.match(key.trim(), scopedpath);
      if (matched) {
        matched.key = routesKey;
        break;
      }
    }

    if (matched) {
      component = config.routes[routesKey];
      splats = [...matched.splats, ...splats];
      match = {
        ...match,
        ...matched.params,
      };
      slash = matched.slash;
      scope = `${scope}${matched.scope}`.replace(/\/$/, '');

      break;
    }
  }

  if (!matched) {
    component = ax.is.undefined(config.default)
      ? (route) => {
          let message = `'${scopedpath}' not found`;
          console.warn(message, route);
          return a['.error'](message);
        }
      : config.default;
  }

  if (ax.is.function(component)) {
    let route = ax.x.router.interface({
      path: config.path,
      query: config.query,
      anchor: config.anchor,
      router: config.router,
      mounts: [...config.mounts, mountElement],
      scope: scope,
      match: match,
      splats: splats,
      slash: slash,
      lazy: lazy,
      default: defaultContent,
      transition: transition,
    });
    component = component(route);
  }

  return {
    matched: matched,
    component: a['ax-appkit-router-view']([component]),
    scope: scope,
  };
};

ax.extensions.router.interface.routes.view.match = (routesKey, scopedpath) => {
  let params = {};
  let splats = [];
  let slash;

  let regexp = ax.x.router.interface.routes.view.match.regexp(routesKey);
  let routeRegex = new RegExp(regexp.string);
  let match = scopedpath.match(routeRegex);

  if (match) {
    let paramKeys = regexp.keys;
    let remove = 0;

    paramKeys.forEach(function (paramKey, i) {
      let matched = match[i + 1];
      if (paramKey === '*') {
        splats.unshift(matched);
      } else if (paramKey == '**') {
        remove = remove + matched.length;
        splats.unshift(matched);
      } else if (paramKey == '?') {
        remove = remove + matched.length;
        slash = matched;
      } else {
        params[paramKey] = matched;
      }
    });

    let keep = scopedpath.length - remove;
    let scope = scopedpath.substring(0, keep);

    return {
      params: params,
      splats: splats,
      slash: slash,
      scope: scope,
    };
  } else {
    return '';
  }
};

ax.extensions.router.interface.routes.view.match.regexp = (route) => {
  let routeRegexp = route
    .replace(/\*$/, '&&catchall&&')
    .replace(/\*/g, '&&wildcard&&')
    .replace(/\/\?/, '&&slash&&');

  let captures =
    routeRegexp.match(/(:\w+|&&wildcard&&|&&catchall&&|&&slash&&)/g) || [];
  let paramKeys = [];

  captures.forEach(function (capture) {
    let paramKey;
    let pattern;
    if (capture === '&&wildcard&&') {
      paramKey = '*';
      pattern = '([^\/]*)';
    } else if (capture === '&&catchall&&') {
      paramKey = '**';
      pattern = '(.*)';
    } else if (capture === '&&slash&&') {
      paramKey = '?';
      pattern = '(\\/?)';
    } else {
      paramKey = capture.slice(1);
      pattern = '([^\\/]*)';
    }
    paramKeys.push(paramKey);
    routeRegexp = routeRegexp.replace(capture, pattern);
  });

  routeRegexp = '^' + routeRegexp + '$';

  return {
    string: routeRegexp,
    keys: paramKeys,
  };
};

}));
