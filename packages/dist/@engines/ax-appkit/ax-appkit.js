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

ax.extension.button = function (options = {}) {
  let a = ax.a;

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

ax.extension.check = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let inputId =
    x.lib.object.dig(options, ['inputTag', 'id']) || x.lib.uuid.generate();

  let inputTagOptions = {
    type: options.type || 'checkbox',
    name: options.name,
    value: options.checked === '' ? '' : options.checked || 'on',
    required: options.required,
    onclick: options.readonly ? 'return false' : 'return true',
    checked: options.value ? 'checked' : undefined,
    ...options.inputTag,
    id: inputId,
  };

  let labelTagOptions = {
    for: inputId,
    ...options.labelTag,
  };

  return a['ax-appkit-check'](
    [
      a.input(null, inputTagOptions),
      a.label(options.label || '', labelTagOptions),
    ],
    options.checkTag
  );
};

ax.extension.cycle = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let period = options.period || 500;
  let collection = options.collection || '⣯⣟⡿⢿⣻⣽⣾⣷';

  let max = collection.length - 1;

  let cycleTag = {
    $state: 0,
    $nodes: (el) => collection[el.$state],
    $init: (el) => {
      setInterval(() => {
        if (el.$state === max) {
          el.$state = 0;
        } else {
          el.$state++;
        }
      }, period);
    },
    ...options.cycleTag,
  };

  return a['ax-appkit-cycle'](null, cycleTag);
};

ax.extension.fetch = (options = {}) => new AxAppkitFetch(options).render();

ax.extension.form = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let f = this.form.factory({
    scope: options.scope,
    object: options.object,
    formOptions: options,
  });

  return f.form(options);
};

ax.extension.out = function (value, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let component;

  if (ax.is.undefined(value)) {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
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

  return a['ax-appkit-out'](component, options.outTag);
};

ax.extension.report = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let r = this.report.factory({
    scope: options.scope,
    object: options.object,
    reportOptions: options,
  });

  return r.report(options);
};

ax.extension.router = (options = {}) => (a, x) => {
  if (options.home) {
    if (window.location.pathname.match(/^$|^\/$/)) {
      window.history.replaceState({}, 'Home', options.home);
    }
  }

  return ax.x.router.element(options);
};

ax.extension.table = function (options = {}) {
  let a = ax.a;

  let component = [];

  let trTag = (i, row) => {
    if (ax.is.function(options.trTag)) {
      return options.trTag(i, row);
    } else {
      return options.trTag;
    }
  };

  let thTag = (i, j, content) => {
    if (ax.is.function(options.thTag)) {
      return options.thTag(i, j, content);
    } else {
      return options.thTag;
    }
  };

  let tdTag = (i, j, content) => {
    if (ax.is.function(options.tdTag)) {
      return options.tdTag(i, j, content);
    } else {
      return options.tdTag;
    }
  };

  let headers;
  if (options.headers == false) {
    headers = {
      rows: [],
      cols: [],
    };
  } else if (options.headers == true || !options.headers) {
    headers = {
      rows: [0],
      cols: [],
    };
  } else {
    headers = {
      rows: options.headers.rows || [],
      cols: options.headers.cols || [],
    };
  }

  let tableCellFor = (i, j, content) => {
    if (headers.rows.includes(i)) {
      let attributes = {
        scope: col,
        ...thTag(i, j, content),
      };
      return a.th(content, attributes);
    } else if (headers.cols.includes(j)) {
      let attributes = {
        scope: row,
        ...thTag(i, j, content),
      };
      return a.th(content, attributes);
    } else {
      return a.td(content, tdTag(i, j, content));
    }
  };

  (options.rows || []).forEach(function (row, i) {
    component.push(
      a.tr(
        row.map(function (content, j) {
          return tableCellFor(i, j, content);
        }),
        trTag(i, row)
      )
    );
  });

  return a.table(component, options.tableTag);
};

ax.extension.time = function (options = {}) {
  const a = ax.a;

  let timeTag = {
    $init: (el) => setInterval(el.$render, 1000),
    $text: () => new Date().toLocaleTimeString(),
    ...options.timeTag,
  };

  return a.time(null, timeTag);
};

ax.extension.transition = {};

class AxAppkitFetch {
  constructor(options = {}) {
    this.multiple = this.determineMultiple(options);
    this.url = options.url;
    this.method = options.method;
    this.query = options.query;
    this.headers = options.headers;
    this.body = options.body;
    this.placeholder = options.placeholder || null;
    this.fetch = options.fetch || {};
    this.fetchTag = options.fetchTag || {};
    this.preprocessWhen = options.when || {};
    this.successCallback = options.success;
    this.errorCallback = options.error;
    this.catchCallback = options.catch;
    this.completeCallback = options.complete;
  }

  determineMultiple(options) {
    return Math.max(
      ...[
        'url',
        'method',
        'query',
        'method',
        'headers',
        'body',
        'fetch',
      ].map((key) => (is.array(options[key]) ? options[key].length : 0))
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
    this.performFetches()
      .then((responses) => this.buildResults(responses))
      .then((results) => this.preprocessResults(results))
      .then((results) => this.renderResults(results))
      .catch((error) => this.renderError(error))
      .finally(() => this.callComplete());
  }

  performFetches() {
    return Promise.all(
      [...Array(this.multiple || 1)].map((_, i) => {
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
    return is.array(this[key]) ? this[key][i] : this[key];
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
      if (this.multiple) {
        this.errorCallback(bodies, this.element, responses);
      } else {
        this.errorCallback(bodies[0], this.element, responses[0]);
      }
    } else {
      this.element.$nodes = a['ax-appkit-fetch-response.error'](bodies);
    }
  }

  renderSuccessResult(results) {
    let bodies = results.map((result) => result.body);
    let responses = results.map((result) => result.response);
    if (this.successCallback) {
      if (this.multiple) {
        this.successCallback(bodies, this.element, responses);
      } else {
        this.successCallback(bodies[0], this.element, responses[0]);
      }
    } else {
      this.element.$nodes = a['ax-appkit-fetch-response.success'](bodies);
    }
  }

  renderError(error) {
    console.error(error);
    if (this.catchCallback) {
      this.catchCallback(error, this.element);
    } else {
      this.element.$nodes = a['ax-appkit-fetch-response.error'](error.message);
    }
  }

  callComplete() {
    if (this.completeCallback) this.completeCallback(this.element);
  }
}

ax.extension.form.factory = function (options) {
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

ax.extension.form.shim = {
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

ax.extension.lib.animate = {};

ax.extension.lib.array = {};

ax.extension.lib.coerce = {};

ax.extension.lib.compact = function (value) {
  let compact = ax.x.lib.compact;

  if (ax.is.array(value)) {
    return compact.array(value);
  } else if (ax.is.object(value)) {
    return compact.object(value);
  } else if (['', undefined, null].includes(value)) {
    return null;
  } else {
    return value;
  }
};

ax.extension.lib.element = {};

ax.extension.lib.form = {};

ax.extension.lib.name = {};

ax.extension.lib.object = {};

ax.extension.lib.query = {};

ax.extension.lib.tabable = function (element) {
  if (element.tabIndex >= 0 && ax.x.lib.element.visible(element)) {
    return true;
  } else {
    return false;
  }
};

ax.extension.lib.text = {};

ax.extension.lib.unnested = function (el, tag) {
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

ax.extension.lib.uuid = {};

ax.extension.out.element = function (value) {
  let a = ax.a;
  let x = ax.x;

  if (ax.is.array(value)) {
    return a['ax-appkit-out-collection'](
      a.ol(value.map((element) => a.li(x.out.element(element))))
    );
  } else if (ax.is.null(value)) {
    return a['ax-appkit-out-null'](null);
  } else if (ax.is.undefined(value)) {
    return a['ax-appkit-out-null'](a.i('UNDEFINED'));
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

ax.extension.report.factory = function (options) {
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

ax.extension.report.shim = {
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

ax.extension.router.element = (options) => {
  let routerTag = {
    id: options.id,
    $init: ax.extension.router.element.init,
    $nodes: ax.extension.router.element.nodes(options),
    $go: ax.extension.router.element.go,
    $open: ax.extension.router.element.open(options),
    $locate: ax.extension.router.element.locate,
    $location: ax.extension.router.element.location,
    $load: ax.extension.router.element.load,
    ...options.routerTag,
  };

  return a['ax-appkit-router'](null, routerTag);
};

ax.extension.router.interface = (config) => {
  let result = {};
  result.path = config.path;
  result.query = config.query;
  result.anchor = config.anchor;
  result.scope = config.scope;
  result.match = config.match;
  result.splat = config.splat;
  result.slash = config.slash;
  result.params = {
    ...config.match,
    ...config.query,
  };
  result.load = ax.x.router.interface.load(config);
  result.open = ax.x.router.interface.open(config);
  result.mount = ax.x.router.interface.mount(config);

  return result;
};

ax.extension.transition.fade = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let duration = (options.duration || 500) / 2;

  return a['ax-appkit-transition'](null, {
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
          if (options.complete) options.complete(el);
        },
      });
    },
    $to: (el) => (component) => {
      if (el.style.opacity == '1') {
        x.lib.animate.fade.out(el, {
          duration: duration,
          complete: () => el.$in(component),
        });
      } else {
        el.$in(component);
      }
    },
    ...options.transitionTag,
  });
};

ax.extension.form.factory.button = function (options = {}) {
  let x = ax.x;

  return x.button(options);
};

ax.extension.form.factory.cancel = (f, options = {}) => {
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
    to: options.to,
    title: options.title,
    buttonTag: options.buttonTag,
    ...options.button,
  };

  return f.button(buttonOptions);
};

ax.extension.form.factory.checkbox = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

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
    options.checkboxTag
  );
};

ax.extension.form.factory.checkboxes = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

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
    options.checkboxesTag
  );
};

ax.extension.form.factory.form = (f, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let form = options.form || (() => null);

  let formTagOptions = {
    id: options.id,
    method: options.method || 'POST',
    action: options.url || options.action,
    $formData: (el) => () => {
      return new FormData(el);
    },
    $data: (el) => () => {
      return x.lib.form.data.objectify(el.$formData());
    },
    ...options.formTag,
  };

  return a.form(form(f), formTagOptions);
};

ax.extension.form.factory.input = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let datalist = null;
  let datalistId;

  if (options.datalist) {
    datalistId = x.lib.uuid.generate();
    datalist = a.datalist(
      options.datalist.map((item) =>
        a.option(null, {
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
    [a.input(null, inputTagOptions), datalist],
    options.wrapperTag
  );
};

ax.extension.form.factory.radios = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

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
        value: value == selection.value ? true : false,
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
    options.radiosTag
  );
};

ax.extension.form.factory.select = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

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
    options.wrapperTag
  );
};

ax.extension.form.factory.submit = (f, options = {}) => {
  let label = options.label === false ? '' : options.label || '✔ Submit';

  let buttonOptions = {
    label: label,
    type: 'submit',
    name: options.name,
    value: options.value,
    onclick: options.onclick,
    title: options.title,
    buttonTag: options.buttonTag,
    ...options.button,
  };

  return f.button(buttonOptions);
};

ax.extension.form.factory.textarea = function (options = {}) {
  let a = ax.a;

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
    options.wrapperTag
  );
};

ax.extension.lib.animate.fade = {};

ax.extension.lib.coerce.boolean = function (value) {
  value = value || false;
  let string = value.toString().toLowerCase();
  return value && string !== 'false' && string !== 'off' && string !== '0';
};

ax.extension.lib.coerce.number = function (value) {
  return Number(value) || 0;
};

ax.extension.lib.coerce.string = function (value) {
  return ax.is.undefined(value) ? '' : String(value);
};

ax.extension.lib.compact.array = function (array) {
  return array.map((value) => this(value)).filter((value) => value != null);
};

ax.extension.lib.compact.object = function (object) {
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

ax.extension.lib.element.visible = function (element) {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
};

ax.extension.lib.form.collection = {};

ax.extension.lib.form.data = {};

ax.extension.lib.form.selections = function (selections) {
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

ax.extension.lib.name.dismantle = (string) =>
  (string.match(/\w+|\[\w*\]|\[\.\.\]/g) || []).map((part) =>
    part.replace(/\[|\]/g, '')
  );

ax.extension.lib.object.assign = function (object, keys, value) {
  let key = keys[0];
  let depth = keys.length;

  if (depth === 1) {
    // Assign the value if no nesting.

    if (key === '' && ax.is.array(object)) {
      object.push(value);
    } else if (key) {
      object[key] = value;
    }
  } else {
    // Assign nested value

    // Look ahead to next key
    let next = keys[1];

    if (key === '') {
      // Build a collection
      let index = object.length - 1;
      let current = object[index];
      if (
        ax.is.object(current) &&
        (depth > 2 || ax.is.undefined(current[next]))
      ) {
        // Add to current item
        key = index;
      } else {
        // Start building next item
        key = index + 1;
      }
    }

    // Create empty object if needed
    if (ax.is.undefined(object[key])) {
      if (next === '') {
        object[key] = [];
      } else {
        object[key] = {};
      }
    }

    // Do next layer of nesting
    this.assign(object[key], keys.slice(1), value);
  }
};

ax.extension.lib.object.dig = function (
  object,
  keys = [],
  defaultValue = null
) {
  let result = object;

  for (let key in keys) {
    if (result == null) {
      return defaultValue;
    } else {
      result = result[keys[key]] || null;
    }
  }

  return result || defaultValue;
};

ax.extension.lib.query.parse = function (queryString) {
  var result = {};

  if (queryString) {
    queryString.split('&').map(function (pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1]);
    });
  }

  return result;
};

ax.extension.lib.query.stringify = function (object, options = {}) {
  var queryString = [];
  var property;

  for (property in object) {
    if (object.hasOwnProperty(property)) {
      var k = options.prefix ? options.prefix + '[' + property + ']' : property,
        v = object[property];
      queryString.push(
        v !== null && ax.is.object(v)
          ? this.stringify(v, {
              prefix: k,
            })
          : encodeURIComponent(k) + '=' + encodeURIComponent(v)
      );
    }
  }
  return queryString.join('&');
};

ax.extension.lib.tabable.next = function (element) {
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

ax.extension.lib.tabable.previous = function (element) {
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

ax.extension.lib.text.capitalize = function (string = '') {
  return string.toString().charAt(0).toUpperCase() + string.slice(1);
};

ax.extension.lib.text.humanize = function (string = '') {
  return string.toString().replace(/_/g, ' ');
};

ax.extension.lib.text.labelize = function (string = '') {
  return this.capitalize(this.humanize(string));
};

ax.extension.lib.uuid.generate = function () {
  return '00000000-0000-4000-0000-000000000000'.replace(/0/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

ax.extension.report.factory.button = function (options = {}) {
  let x = ax.x;

  return x.button(options);
};

ax.extension.report.factory.checkbox = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

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

ax.extension.report.factory.checkboxes = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

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

ax.extension.report.factory.output = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

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

ax.extension.report.factory.radios = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

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

ax.extension.report.factory.report = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let report = options.report || (() => null);

  let reportTagOptions = {
    ...options.reportTag,
  };

  return a['ax-appkit-report'](report(r), reportTagOptions);
};

ax.extension.report.factory.select = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

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
    }
  }
  labels = labels.join(', ');

  let selectTagOptions = {
    name: options.name,
    ...options.selectTag,
  };

  if (!labels) {
    labels = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  return a['ax-appkit-report-select'](labels, {
    tabindex: 0,
    ...selectTagOptions,
  });
};

ax.extension.report.factory.string = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let value = options.value || '';

  let component;

  if (options.value) {
    component = options.value.toString();
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  return a['ax-appkit-report-string'](component, {
    tabindex: 0,
    ...options.stringTag,
  });
};

ax.extension.report.factory.text = function (options = {}) {
  let a = ax.a;

  let component;

  if (options.value) {
    component = options.value;
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  return a['ax-appkit-report-text'](
    a.textarea(component, {
      readonly: true,
      ...options.textareaTag,
    }),
    options.textTag
  );
};

ax.extension.router.element.go = (el) => () => {
  let location = el.$location();
  el.$load(location.path, location.query, location.anchor);
};

ax.extension.router.element.init = (el) => {
  const pop = () => el.$go();
  window.addEventListener('popstate', pop);
  el.$send('ax.appkit.router.load', {
    detail: el.$location(),
  });
};

ax.extension.router.element.load = (el) => (path, query, anchor) => {
  let mounted = x.lib.unnested(el, 'ax-appkit-router-mount');

  mounted.forEach((r) => {
    r.$load(path, query, anchor);
  });

  el.$send('ax.appkit.router.load', {
    detail: {
      path: path,
      query: query,
      anchor: anchor,
    },
  });
};

ax.extension.router.element.locate = (el) => (path, query, anchor) => {
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

ax.extension.router.element.location = (el) => () => {
  let location = window.location;

  return {
    path: location.pathname,
    query: x.lib.query.parse(location.search.slice(1)),
    anchor: location.hash.slice(1),
  };
};

ax.extension.router.element.nodes = (options) => (el) => {
  let start = el.$location();

  let config = {
    path: start.path,
    query: start.query,
    anchor: start.anchor,
    scope: options.scope, // || '',
    default: options.default,
    home: options.home,
    lazy: options.lazy,
    transition: options.transition,
    router: el,
    mounts: [],
  };

  let routes = options.routes || {};

  let router = x.router.interface(config);

  if (ax.is.function(routes)) {
    return routes(router);
  } else {
    return router.mount({ routes: routes });
  }
};

ax.extension.router.element.open = (options) => (el) => (
  path,
  query,
  anchor
) => {
  if (path[0] != '/') {
    path = options.scope + (path ? `/${path}` : '');
  }

  el.$locate(path, query, anchor);

  el.$send('ax.appkit.router.open', {
    detail: {
      path: path,
      query: query,
      anchor: anchor,
    },
  });
};

ax.extension.router.interface.load = (config) =>
  function (locator = null, query = {}, anchor = null) {
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
        // let toLocation = {
        //   path: path,
        //   query: query,
        //   anchor: anchor,
        // };

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
          // let location = toLocation;
          let routes = x.lib.unnested(el, 'ax-appkit-router-mount');

          routes.forEach((r) => {
            r.$load(path, query, anchor);
          });
        } else {
          el.$scope = locatedView.scope;

          if (transition) {
            el.$('ax-appkit-transition').$to(locatedView.component);
          } else {
            el.$nodes = locatedView.component;
          }

          el.$matched = locatedView.matched;
        }
      },

      ...options.mountTag,
    };

    return a['ax-appkit-router-mount'](null, mountTag);
  };
};

ax.extension.router.interface.open = (config) => (
  locator = null,
  query = {},
  anchor = null
) => {
  if (locator) {
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
  } else {
    config.router.$go();
  }
};

ax.extension.form.factory.select.options = function (options) {
  let a = ax.a;
  let x = ax.x;

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

ax.extension.lib.animate.fade.in = function (el, options = {}) {
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

ax.extension.lib.animate.fade.out = function (el, options = {}) {
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

ax.extension.lib.animate.fade.toggle = function (el, options = {}) {
  if (el.style.display === 'none') {
    this.in(el, options);
  } else {
    this.out(el, options);
  }
};

ax.extension.lib.form.collection.value = function (value) {
  if (ax.is.array(value)) {
    return value;
  } else if (value) {
    return [value];
  } else {
    return [];
  }
};

ax.extension.lib.form.data.objectify = function (data) {
  let x = ax.x;
  let object = {};

  for (var pair of data.entries()) {
    x.lib.object.assign(object, x.lib.name.dismantle(pair[0]), pair[1]);
  }

  return object;
};

ax.extension.lib.form.data.stringify = function (data) {
  let x = ax.x;
  return JSON.stringify(x.lib.form.data.objectify(data));
};

ax.extension.lib.form.data.urlencoded = function (data) {
  let x = ax.x;
  let parts = [];

  for (var pair of data.entries()) {
    parts.push(`${pair[0]}=${pair[1]}`);
  }

  return parts.join('&');
};

ax.extension.router.interface.mount.transition = (transition) => {
  if (ax.is.string(transition)) {
    return ax.x.transition[transition]();
  } else if (ax.is.array(transition)) {
    let name = transition[0];
    let options = transition[1];
    return ax.x.transition[name](options);
  } else if (ax.is.function(transition)) {
    return transition();
  }
};

ax.extension.router.interface.mount.view = (config, mountElement) => {
  let scope = config.scope || '';
  let scopedpath = config.path.slice(scope.length);
  let match = config.match || {};
  let splat = config.splat || [];
  let lazy = config.lazy;
  let defaultContent = config.default;
  let transition = config.transition;
  let component;
  let slash;
  let matched;

  let routesKeys = Object.keys(config.routes);

  for (let i in routesKeys) {
    let routesKey = routesKeys[i];

    matched = ax.x.router.interface.mount.view.match(routesKey, scopedpath);

    if (matched) {
      component = config.routes[routesKey];
      splat = [...matched.splat, ...splat];
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
      ? (router) => {
          let message = `'${scopedpath}' not found`;
          let el = config.mounts[config.mounts.length - 1];
          console.warn(message, router);
          return (a, x) => a['.error'](message);
        }
      : config.default;
  }

  if (ax.is.function(component)) {
    let controller = ax.x.router.interface({
      path: config.path,
      query: config.query,
      anchor: config.anchor,
      router: config.router,
      mounts: [...config.mounts, mountElement],
      scope: scope,
      match: match,
      splat: splat,
      slash: slash,
      lazy: lazy,
      default: defaultContent,
      transition: transition,
    });
    component = ax.a['ax-appkit-router-view']([component(controller)], {
      $init: (el) => {
        if (config.anchor) {
          let anchored = window.document.getElementById(config.anchor);
          if (!anchored)
            console.warn(
              `Router cannot find #${config.anchor} to scroll into view.`
            );
          if (anchored) anchored.scrollIntoView();
        }
      },
    });
  }

  return {
    matched: !!matched,
    component: component,
    scope: scope,
  };
};

ax.extension.router.interface.mount.view.match = (routesKey, scopedpath) => {
  let params = {};
  let splat = [];
  let slash;

  let regexp = ax.x.router.interface.mount.view.match.regexp(routesKey);
  let routeRegex = new RegExp(regexp.string);
  let match = scopedpath.match(routeRegex);

  if (match) {
    let paramKeys = regexp.keys;
    let remove = 0;

    paramKeys.forEach(function (paramKey, i) {
      let matched = match[i + 1];
      if (paramKey === '*') {
        splat.unshift(matched);
      } else if (paramKey == '**') {
        remove = remove + matched.length;
        splat.unshift(matched);
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
      splat: splat,
      slash: slash,
      scope: scope,
    };
  } else {
    return null;
  }
};

ax.extension.router.interface.mount.view.match.regexp = (route) => {
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
      pattern = '([^\\/|^\\.]*)';
    } else if (capture === '&&catchall&&') {
      paramKey = '**';
      pattern = '(.*)';
    } else if (capture === '&&slash&&') {
      paramKey = '?';
      pattern = '(\\/?)';
    } else {
      paramKey = capture.slice(1);
      pattern = '([^\\/|^\\.]*)';
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
