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

ax.extensions.form.field = {};

ax.extensions.report.field = {};

ax.extensions.form.field.button = (target, options = {}) =>
  target({
    ...options,
    buttonTag: {
      $enabled: true,
      $disable: (el) => () => {
        el.$enabled = false;
        el.disabled = 'disabled';
      },
      $enable: (el) => () => {
        el.$enabled = true;
        el.removeAttribute('disabled');
      },
      ...options.buttonTag,
    },
  });

ax.extensions.form.field.collection = function (f, control, options = {}) {
  let values = x.lib.form.collection.value(options.value);

  let itemFn = (value) =>
    a['ax-appkit-control-collection-item'](
      [
        a['ax-appkit-control-collection-item-header'](
          a['ax-appkit-control-collection-item-buttons'](
            [
              options.moveable
                ? this.collection.up(f, options.upButton || {})
                : '',
              options.moveable
                ? this.collection.down(f, options.downButton || {})
                : '',
              options.removeable
                ? this.collection.remove(f, {
                    singular: options.singular,
                    ...options.removeButton,
                  })
                : '',
            ],
            options.itemButtonsTag || {}
          ),
          options.itemHeaderTag || {}
        ),
        a['ax-appkit-control-collection-item-body'](
          control({
            ...options,
            name: `${options.name}[]`,
            value: value,
          }),
          options.itemBodyTag || {}
        ),
      ],
      options.itemTag || {}
    );

  let components = values.map((value) => itemFn(value));

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return el.$$('ax-appkit-form-control').$value().$$;
    },

    $focus: (el) => () => {
      let first = el.$('ax-appkit-form-control');
      if (first) setTimeout(first.$focus, 0);
    },

    $enabled: !options.disabled,

    $disable: (el) => () => {
      el.$enabled = false;
      let controls = el.$$('ax-appkit-form-control').$$;
      for (let control of controls) {
        control.$disable();
      }
    },

    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        let controls = el.$$('ax-appkit-form-control').$$;
        for (let control of controls) {
          control.$enable();
        }
      }
    },

    ...options.controlTag,
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-control-collection'](
      [
        a['ax-appkit-control-collection-items'](components, {
          $add: (el) => () => {
            el.append(itemFn());
          },
          ...options.itemsTag,
        }),
        options.addable
          ? this.collection.add(f, {
              singular: options.singular,
              ...options.addButton,
            })
          : '',
      ],
      options.collectionTag || {}
    ),
    controlTagOptions
  );
};

ax.extensions.form.field.control = function (f, options = {}) {
  let controlFn = f.controls[options.as || 'input'];
  if (!controlFn) {
    throw new Error(
      `Form field factory does not support control '${options.as}'.`
    );
  }

  let key = options.key || '';

  let name = options.name || (f.scope ? `${f.scope}[${key}]` : key);

  let object = f.object || {};

  if (ax.is.function(options.ingest)) {
    options.value = options.ingest(object[key]);
  } else if (key && ax.is.not.undefined(object[key])) {
    options.value = object[key];
  }

  let controlOptions = {
    ...options,
    name: name,
    ...options.control,
    controlTag: {
      $key: key,
      $output: (el) => () => {
        return ax.is.function(options.digest)
          ? options.digest(el.$value())
          : el.$value();
      },
      ...(options.control || {}).controlTag,
    },
  };

  if (options.collection) {
    return this.collection(f, controlFn, controlOptions);
  } else {
    return controlFn(controlOptions);
  }
};

ax.extensions.form.field.controls = {};

ax.extensions.form.field.field = function (f, options = {}) {
  if (options.as == 'hidden') {
    options.label = false;
    options.help = false;
    options.hint = false;
  }

  return a['ax-appkit-form-field'](
    [
      this.header(f, options),
      a['ax-appkit-form-field-body'](
        [
          f.help(options),
          f.control({
            ...options,
            // Controls don't normally need labels. Checkbox is exception.
            // Label for checkbox needs to be specified in options.control.
            // options.label and options.labelTag consumed by field.header()
            label: false,
            labelTag: {},
          }),
          f.hint(options),
        ],
        options.bodyTag || {}
      ),
    ],
    options.fieldTag || {}
  );
};

ax.extensions.form.field.fieldset = function (f, options = {}) {
  let control = a[
    'ax-appkit-form-control.ax-appkit-form-control-without-value'
  ](
    [
      options.legend ? a.legend(options.legend, options.legendTag || {}) : '',
      options.body || '',
    ],
    {
      $controls: (el) => () => {
        return x.lib.unnested(el, 'ax-appkit-form-control');
      },
      $buttons: (el) => () => {
        return el.$$('button').$$;
      },
      $enabled: true,
      $disable: (el) => () => {
        el.$enabled = false;
        let controls = [...el.$controls(), ...el.$buttons()];
        for (let i in controls) {
          controls[i].$disable && controls[i].$disable();
        }
      },
      $enable: (el) => () => {
        el.$enabled = true;
        let controls = [...el.$controls(), ...el.$buttons()];
        for (let i in controls) {
          controls[i].$enable && controls[i].$enable();
        }
      },
      $focus: (el) => () => {
        let first = el.$controls()[0];
        if (first) first.$focus();
      },
    }
  );

  options.label = options.label ? options.label : false;

  return a['ax-appkit-form-field'](
    a.fieldset(
      [
        this.header(f, options),
        a['ax-appkit-form-field-body'](
          [f.help(options), control, f.hint(options)],
          options.bodyTag || {}
        ),
      ],
      options.fieldsetTag || {}
    )
  );
};

ax.extensions.form.field.header = function (f, options = {}) {
  let component;

  if (options.header == true) {
    options.header = null;
  } else if (options.header == false) {
    return '';
  }

  if (options.header) {
    // TODO: is header declared? same in report
    component = header;
  } else {
    let caption = options.label === false ? '' : f.label(options);
    if (options.help) {
      component = [caption, f.helpbutton(options)];
    } else {
      component = caption;
    }
  }

  return a['ax-appkit-form-field-header'](component, options.headerTag || {});
};

ax.extensions.form.field.help = function (options = {}) {
  return options.help
    ? a['ax-appkit-form-field-help-wrapper'](
        a['ax-appkit-form-field-help'](options.help, {
          $toggle: (el) => () => {
            x.lib.animate.fade.toggle(el);
          },
          ...options.helpTag,
          style: {
            display: 'none',
            ...(options.helpTag || {}).style,
          },
        }),
        options.wrapperTag || {}
      )
    : '';
};

ax.extensions.form.field.helpbutton = function (options = {}) {
  return a['ax-appkit-form-field-helpbutton']({
    $showHelp: false,
    $nodes: (el) => {
      let show = el.$showHelp;
      return a['ax-appkit-form-field-helpbutton-text'](
        el.show ? ' ❓ ✖ ' : ' ❓ '
      );
    },
    ...options.helpbuttonTag,
    $on: {
      'click: toggle help': (e) => {
        let el = e.currentTarget;
        el.$showHelp = !el.$showHelp;
        el.$render();
        el.$('^ax-appkit-form-field', 'ax-appkit-form-field-help').$toggle();
      },
      ...(options.helpbuttonTag || []).$on,
    },
    style: {
      cursor: 'help',
      ...(options.helpbuttonTag || {}).style,
    },
  });
};

ax.extensions.form.field.hint = function (options = {}) {
  return options.hint
    ? a['ax-appkit-form-field-hint'](
        a.small(options.hint),
        options.hintTag || {}
      )
    : '';
};

ax.extensions.form.field.icons = {};

ax.extensions.form.field.label = function (options = {}) {
  let label = options.label || x.lib.text.labelize(options.key);
  let component = a.label(label, options.labelTag || {});

  let wrapperTag = {
    ...options.wrapperTag,

    $on: {
      'click: focus on input': (e) => {
        let el = e.currentTarget;
        let target = el.$('^ax-appkit-form-field ax-appkit-form-control');
        target.$focus();
      },
      ...(options.wrapperTag || {}).$on,
    },
  };

  return a['ax-appkit-form-field-label-wrapper'](component, wrapperTag);
};

ax.extensions.form.field.shim = {
  button: (f, target) => (options = {}) =>
    ax.x.form.field.button(target, options),
  field: (f, target) => (options = {}) => ax.x.form.field.field(f, options),
  fieldset: (f, target) => (options = {}) =>
    ax.x.form.field.fieldset(f, options),
  label: (f, target) => (options = {}) => ax.x.form.field.label(options),
  help: (f, target) => (options = {}) => ax.x.form.field.help(options),
  helpbutton: (f, target) => (options = {}) =>
    ax.x.form.field.helpbutton(options),
  hint: (f, target) => (options = {}) => ax.x.form.field.hint(options),
  control: (f, target) => (options = {}) => ax.x.form.field.control(f, options),
  controls: {
    input: (f, target) => (options = {}) =>
      ax.x.form.field.controls.input(f, options),
    select: (f, target) => (options = {}) =>
      ax.x.form.field.controls.select(f, options),
    textarea: (f, target) => (options = {}) =>
      ax.x.form.field.controls.textarea(f, options),
    checkbox: (f, target) => (options = {}) =>
      ax.x.form.field.controls.checkbox(f, options),
    checkboxes: (f, target) => (options = {}) =>
      ax.x.form.field.controls.checkboxes(f, options),
    radios: (f, target) => (options = {}) =>
      ax.x.form.field.controls.radios(f, options),
    hidden: (f, target) => (options = {}) =>
      ax.x.form.field.controls.hidden(f, options),
  },
};

ax.extensions.report.field.collection = function (f, control, options = {}) {
  let values = x.lib.form.collection.value(options.value);

  let itemFn = (value) =>
    a['ax-appkit-control-collection-item'](
      [
        a['ax-appkit-control-collection-item-header'](
          options.itemHeaderTag || {}
        ),
        a['ax-appkit-control-collection-item-body'](
          control({
            ...options,
            name: `${options.name}[]`,
            value: value,
          }),
          options.itemBodyTag || {}
        ),
      ],
      options.itemTag || {}
    );

  let components = values.map((value) => itemFn(value));

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      let first = el.$('ax-appkit-report-control');
      if (first) setTimeout(first.$focus, 0);
    },
    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    a['ax-appkit-control-collection'](
      [
        a['ax-appkit-control-collection-items'](
          components,
          options.itemsTag || {}
        ),
      ],
      options.collectionTag || {}
    ),
    controlTagOptions
  );
};

ax.extensions.report.field.control = function (r, options = {}) {
  let controlFn = r.controls[options.as || 'output'];
  if (!controlFn) {
    throw new Error(
      `Report field factory does not support control '${options.as}'.`
    );
  }

  let key = options.key || '';

  let name = options.name || (r.scope ? `${r.scope}[${key}]` : key);

  let object = r.object || {};

  if (ax.is.function(options.ingest)) {
    options.value = options.ingest(object[key]);
  } else if (key && ax.is.not.undefined(object[key])) {
    options.value = object[key];
  }

  let controlOptions = {
    ...options,
    name: name,
    ...options.control,
  };

  if (options.collection) {
    return this.collection(r, controlFn, controlOptions);
  } else {
    return controlFn(controlOptions);
  }
};

ax.extensions.report.field.controls = {};

ax.extensions.report.field.field = function (r, options = {}) {
  if (options.as == 'hidden') {
    options.label = false;
    options.help = false;
    options.hint = false;
  }

  return a['ax-appkit-report-field'](
    [
      this.header(r, options),
      a['ax-appkit-report-field-body'](
        [
          r.help(options),
          r.control({
            ...options,
            label: false,
            labelTag: {},
          }),
          r.hint(options),
        ],
        options.bodyTag || {}
      ),
    ],
    options.fieldTag || {}
  );
};

ax.extensions.report.field.fieldset = function (f, options = {}) {
  let control = a['ax-appkit-report-control'](
    [
      options.legend ? a.legend(options.legend, options.legendTag || {}) : '',
      options.body || '',
    ],
    {
      $focus: (el) => () => {
        let first = el.$('ax-appkit-report-control')[0];
        if (first) first.$focus();
      },
    }
  );

  options.label = options.label ? options.label : false;

  return a['ax-appkit-report-field'](
    a.fieldset(
      [
        this.header(f, options),
        a['ax-appkit-report-field-body'](
          [f.help(options), control, f.hint(options)],
          options.bodyTag || {}
        ),
      ],
      options.fieldsetTag || {}
    )
  );
};

ax.extensions.report.field.header = function (r, options = {}) {
  if (options.type == 'hidden') {
    return '';
  } else {
    let component;

    if (options.header == true) {
      options.header = null;
    } else if (options.header == false) {
      return '';
    }

    if (options.header) {
      component = header;
    } else {
      let caption = r.label(options);
      if (options.help) {
        component = [caption, r.helpbutton(options)];
      } else {
        component = caption;
      }
    }

    return a['ax-appkit-report-field-header'](
      component,
      options.headerTag || {}
    );
  }
};

ax.extensions.report.field.help = function (options = {}) {
  let help = options.help;

  return help
    ? a['ax-appkit-report-field-help-wrapper'](
        a['ax-appkit-report-field-help'](help, {
          $toggle: (el) => () => {
            x.lib.animate.fade.toggle(el);
          },
          ...options.helpTag,
          style: {
            display: 'none',
            ...(options.helpTag || {}).style,
          },
        }),
        options.wrapperTag || {}
      )
    : '';
};

ax.extensions.report.field.helpbutton = function (options = {}) {
  return a['ax-appkit-report-field-helpbutton']({
    $showHelp: false,
    $nodes: (el) => {
      return a['ax-appkit-report-field-helpbutton-text'](
        el.$showHelp ? ' ❓ ✖ ' : ' ❓ '
      );
    },
    $on: {
      'click: toggle help': (e) => {
        let el = e.currentTarget;
        el.$showHelp = !el.$showHelp;
        el.$render();
        el.$(
          '^ax-appkit-report-field',
          'ax-appkit-report-field-help'
        ).$toggle();
      },
    },
    ...options.helpbuttonTag,
    style: {
      cursor: 'help',
      ...(options.helpbuttonTag || {}).style,
    },
  });
};

ax.extensions.report.field.hint = function (options = {}) {
  let hint = options.hint;

  return hint
    ? a['ax-appkit-report-field-hint'](a.small(hint), options.hintTag || {})
    : '';
};

ax.extensions.report.field.label = function (options = {}) {
  if (ax.is.false(options.label)) return '';
  let label = options.label || x.lib.text.labelize(options.key);
  if (!label) return '';
  let component = a.label(label, options.labelTag || {});

  let wrapperTag = {
    ...options.wrapperTag,

    $on: {
      'click: focus on output': (e) => {
        let el = e.currentTarget;
        let target = el.$('^ax-appkit-report-field ax-appkit-report-control');
        target && target.$focus();
      },
      ...(options.wrapperTag || {}).$on,
    },
  };

  return a['ax-appkit-report-field-label-wrapper'](component, wrapperTag);
};

ax.extensions.report.field.shim = {
  field: (r, target) => (options = {}) => ax.x.report.field.field(r, options),
  fieldset: (f, target) => (options = {}) =>
    ax.x.report.field.fieldset(f, options),
  label: (r, target) => (options = {}) => ax.x.report.field.label(options),
  help: (r, target) => (options = {}) => ax.x.report.field.help(options),
  helpbutton: (r, target) => (options = {}) =>
    ax.x.report.field.helpbutton(options),
  hint: (r, target) => (options = {}) => ax.x.report.field.hint(options),
  validation: (r, target) => (options = {}) =>
    ax.x.report.field.validation(options),
  control: (r, target) => (options = {}) =>
    ax.x.report.field.control(r, options),
  controls: {
    checkbox: (r, target) => (options = {}) =>
      ax.x.report.field.controls.checkbox(r, options),
    checkboxes: (r, target) => (options = {}) =>
      ax.x.report.field.controls.checkboxes(r, options),
    string: (r, target) => (options = {}) =>
      ax.x.report.field.controls.string(r, options),
    select: (r, target) => (options = {}) =>
      ax.x.report.field.controls.select(r, options),
    radios: (r, target) => (options = {}) =>
      ax.x.report.field.controls.radios(r, options),
    text: (r, target) => (options = {}) =>
      ax.x.report.field.controls.text(r, options),
    output: (r, target) => (options = {}) =>
      ax.x.report.field.controls.output(r, options),
    hidden: (r, target) => (options = {}) =>
      ax.x.report.field.controls.hidden(r, options),
  },
};

ax.extensions.report.field.validation = function (options = {}) {
  let message;
  let validity = { valid: true };

  if (options.required && !options.value) {
    message = 'Requires a value.';
    validity.valid = false;
    validity.valueMissing = true;
  }
  if (
    options.value &&
    options.controlPattern &&
    !options.value.toString().match(options.controlPattern)
  ) {
    validity.valid = false;
    validity.typeMismatch = true;
  }
  if (
    options.value &&
    options.pattern &&
    !options.value.toString().match(options.pattern)
  ) {
    validity.valid = false;
    validity.patternMismatch = true;
  }

  if (validity.valid) return '';

  if (ax.is.function(options.invalid)) {
    message = options.invalid(options.value, validity) || '';
  } else if (ax.is.string(options.invalid)) {
    message = options.invalid;
  } else if (!validity.valueMissing && options.controlInvalid) {
    message = options.controlInvalid;
  }

  return a['ax-appkit-report-field-validation.error'](
    a.small(message),
    options.validationTag || {}
  );
};

ax.extensions.form.field.collection.add = function (f, options) {
  let label = `✚ Add${options.singular ? ` ${options.singular}` : ''}`;

  return f.button({
    label: label,
    onclick: (e) => {
      let el = e.currentTarget;
      let itemsTag = options.target
        ? options.target(el)
        : el.$(
            '^ax-appkit-control-collection ax-appkit-control-collection-items'
          );
      itemsTag.$add();
      itemsTag.$send('ax.appkit.form.collection.item.add');
    },
    ...options,
  });
};

ax.extensions.form.field.collection.down = function (f, options) {
  return f.button({
    label: x.form.field.icons.down(),
    onclick: (e) => {
      let el = e.currentTarget;
      var target = options.itemTarget
        ? options.itemTarget(el)
        : el.$('^ax-appkit-control-collection-item');
      var next = target.nextSibling;
      var parent = target.parentElement;
      if (next) {
        parent.insertBefore(target, next.nextSibling);
        el.focus();
        el.$send('ax.appkit.form.collection.item.move');
      }
    },
    ...options,
  });
};

ax.extensions.form.field.collection.remove = function (f, options) {
  let singular = options.singular || 'item';
  let confirmation;

  if (ax.is.false(options.confirm)) {
    confirmation = false;
  } else if (ax.is.string(options.confirm) || ax.is.function(options.confirm)) {
    confirmation = options.confirm;
  } else {
    confirmation = `Are you sure that you want to remove this ${singular}?`;
  }

  return f.button({
    label: x.form.field.icons.remove(),
    confirm: confirmation,
    onclick: (e) => {
      let el = e.currentTarget;
      var target = el.$('^ax-appkit-control-collection-item');
      let parent = target.parentElement;
      let index = Array.prototype.indexOf.call(parent.children, target);
      target.remove();
      (ax.x.lib.tabable.next(parent) || window.document.body).focus();
      let length = parent.children.length;
      parent.$send('ax.appkit.form.collection.item.remove', {
        detail: {
          target: el,
          index: index,
          length: length,
        },
      });
    },
    ...options,
  });
};

ax.extensions.form.field.collection.up = function (f, options) {
  return f.button({
    label: x.form.field.icons.up(),
    onclick: (e) => {
      let el = e.currentTarget;
      var target = options.itemTarget
        ? options.itemTarget(el)
        : el.$('^ax-appkit-control-collection-item');
      var previous = target.previousSibling;
      var parent = target.parentElement;
      if (previous) {
        parent.insertBefore(target, previous);
        el.focus();
        el.$send('ax.appkit.form.collection.item.move');
      }
    },
    ...options,
  });
};

ax.extensions.form.field.controls.checkbox = function (f, options) {
  let controlTagOptions = {
    $value: (el) => () => {
      if (el.$('input').checked) {
        return el.$('input').value;
      } else {
        return '';
      }
    },

    $focus: (el) => () => {
      el.$('input').focus();
    },

    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$('input').setAttribute('disabled', 'disabled');
    },

    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        el.$('input').removeAttribute('disabled');
      }
    },

    $validity: (el) => () => {
      return el.$('input').validity;
    },

    $valid: (el) => () => {
      el.$('input').setCustomValidity('');
      if (el.$validity().valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(el.$value, el.$validity());
            if (invalidMessage) {
              el.$('input').setCustomValidity(invalidMessage);
            }
          } else {
            el.$('input').setCustomValidity(options.invalid);
          }
        }
        return false;
      }
    },

    ...options.controlTag,

    $on: {
      'input: check validity': (e) => {
        let el = e.currentTarget;
        el.$valid();
      },
      'input: send control change event': (e) => {
        let el = e.currentTarget;
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.checkbox(options), controlTagOptions);
};

ax.extensions.form.field.controls.checkboxes = function (f, options) {
  let controlTagOptions = {
    name: options.name,

    $value: (el) => () => {
      return el.$$('input:checked').value.$$;
    },

    $focus: (el) => () => {
      el.$('input').focus();
    },

    $controls: (el) => () => {
      return el.$$('ax-appkit-form-control').$$;
    },

    $inputs: (el) => () => {
      return el.$$('input').$$;
    },

    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      for (let input of el.$inputs()) {
        input.setAttribute('disabled', 'disabled');
      }
    },

    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        for (let input of el.$inputs()) {
          if (!input.$ax.disabled) {
            input.removeAttribute('disabled');
          }
        }
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e) => {
        if (options.readonly) e.preventDefault();
      },
      'change: send control change event': (e) => {
        let el = e.currentTarget;
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.checkboxes(options), controlTagOptions);
};

ax.extensions.form.field.controls.hidden = (f, options = {}) => {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {},
    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$('input').setAttribute('disabled', 'disabled');
    },
    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        el.$('input').removeAttribute('disabled');
      }
    },
    ...options.controlTag,
  };

  return a['ax-appkit-form-control.ax-appkit-form-control-not-focusable'](
    f.input({
      name: options.name,
      value: options.value,
      type: 'hidden',
      ...options.inputTag,
    }),
    controlTagOptions
  );
};

ax.extensions.form.field.controls.input = function (f, options) {
  let controlTagOptions = {
    $value: (el) => () => {
      return el.$('input').value;
    },

    $focus: (el) => () => {
      el.$('input').focus();
    },

    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$('input').setAttribute('disabled', 'disabled');
    },

    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        el.$('input').removeAttribute('disabled');
      }
    },

    $validity: (el) => () => {
      return el.$('input').validity;
    },

    $valid: (el) => () => {
      el.$('input').setCustomValidity('');
      let validity = el.$validity();
      if (validity.valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(el.$value(), validity, el);
            if (invalidMessage) {
              el.$('input').setCustomValidity(invalidMessage);
            }
          } else {
            el.$('input').setCustomValidity(options.invalid);
          }
        }
        el.$('input').reportValidity();
        return false;
      }
    },

    ...options.controlTag,

    $on: {
      'input: check validity': (e) => {
        let el = e.currentTarget;
        el.$valid();
      },
      'input: send control change event': (e) => {
        let el = e.currentTarget;
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.input(options), controlTagOptions);
};

ax.extensions.form.field.controls.radios = function (f, options) {
  let controlTagOptions = {
    $value: (el) => () => {
      let checked = el.$('input:checked');
      return checked ? checked.value : '';
    },

    $focus: (el) => () => {
      el.$('input').focus();
    },

    $inputs: (el) => () => {
      return el.$$('input').$$;
    },

    $enabled: !options.disabled,

    $disable: (el) => () => {
      el.$enabled = false;
      for (let input of el.$inputs()) {
        input.setAttribute('disabled', 'disabled');
      }
    },

    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        for (let input of el.$inputs()) {
          if (!input.$ax.disabled) {
            input.removeAttribute('disabled');
          }
        }
      }
    },

    $validity: (el) => () => {
      return el.$('input').validity;
    },

    $valid: (el) => () => {
      el.$('input').setCustomValidity('');
      if (el.$validity().valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(el.$value, el.$validity());
            if (invalidMessage) {
              el.$('input').setCustomValidity(invalidMessage);
            }
          } else {
            el.$('input').setCustomValidity(options.invalid);
          }
        }
        return false;
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e) => {
        if (options.readonly) e.preventDefault();
      },
      'input: check validity': (e) => {
        let el = e.currentTarget;
        el.$valid();
      },
      'change: send control change event': (e) => {
        let el = e.currentTarget;
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.radios(options), controlTagOptions);
};

ax.extensions.form.field.controls.select = function (f, options) {
  let controlTagOptions = {
    $value: (el) => () => {
      return el.$('select').value;
    },

    $focus: (el) => () => {
      el.$('select').focus();
    },

    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$('select').setAttribute('disabled', 'disabled');
    },

    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        el.$('select').removeAttribute('disabled');
      }
    },

    $validity: (el) => () => {
      return el.$('select').validity;
    },

    $valid: (el) => () => {
      el.$('select').setCustomValidity('');
      if (el.$validity().valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(el.$value, el.$validity);
            if (invalidMessage) {
              el.$('select').setCustomValidity(invalidMessage);
            }
          } else {
            el.$('select').setCustomValidity(options.invalid);
          }
        }
        return false;
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e) => {
        let el = e.currentTarget;
        if (options.readonly) e.preventDefault();
      },
      'change: check validity': (e) => {
        let el = e.currentTarget;
        el.$valid();
      },
      'change: send control change event': (e) => {
        let el = e.currentTarget;
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.select(options), controlTagOptions);
};

ax.extensions.form.field.controls.textarea = (f, options = {}) => {
  let controlTagOptions = {
    $init: (el) => {
      setTimeout(() => {
        el.$resize();
        // el.$valid()
      }, 0);
    },

    $value: (el) => () => {
      return el.$('textarea').value;
    },

    $focus: (el) => () => {
      el.$('textarea').focus();
    },

    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$('textarea').setAttribute('disabled', 'disabled');
    },

    $enable: (el) => () => {
      el.$enabled = true;
      if (!options.disabled) {
        el.$('textarea').removeAttribute('disabled');
      }
    },

    $validity: (el) => () => {
      return el.$('textarea').validity;
    },

    $valid: (el) => () => {
      el.$('textarea').setCustomValidity('');
      if (el.$validity().valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(el.$value, el.$validity);
            if (invalidMessage) {
              el.$('textarea').setCustomValidity(invalidMessage);
            }
          } else {
            el.$('textarea').setCustomValidity(options.invalid);
          }
        }
        return false;
      }
    },

    $resize: (el) => () => {
      x.form.field.controls.textarea.resize(el, options);
    },

    ...options.controlTag,

    $on: {
      'input: check validity': (e) => {
        let el = e.currentTarget;
        el.$valid();
      },
      'input: send control change event and resize': (e) => {
        let el = e.currentTarget;
        el.$send('ax.appkit.form.control.change');
        el.$resize();
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.textarea(options), controlTagOptions);
};

ax.extensions.form.field.icons.down = () =>
  a({
    $tag: ['http://www.w3.org/2000/svg', 'svg'],
    height: 22,
    width: 13,
    viewBox: '0 0 22 13',
    $nodes: [
      a({
        $tag: ['http://www.w3.org/2000/svg', 'g'],
        transform: 'scale(0.04)',
        $nodes: [
          a({
            $tag: ['http://www.w3.org/2000/svg', 'path'],
            style: { fill: 'currentColor' },
            d: `M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z`,
          }),
        ],
      }),
    ],
  });

ax.extensions.form.field.icons.remove = () =>
  a({
    $tag: ['http://www.w3.org/2000/svg', 'svg'],
    height: 22,
    width: 14,
    viewBox: '0 0 22 14',
    $nodes: [
      a({
        $tag: ['http://www.w3.org/2000/svg', 'g'],
        transform: 'scale(0.04)',
        $nodes: [
          a({
            $tag: ['http://www.w3.org/2000/svg', 'path'],
            style: { fill: 'currentColor' },
            d: `M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z`,
          }),
        ],
      }),
    ],
  });

ax.extensions.form.field.icons.up = () =>
  a({
    $tag: ['http://www.w3.org/2000/svg', 'svg'],
    height: 22,
    width: 13,
    viewBox: '0 0 22 13',
    $nodes: [
      a({
        $tag: ['http://www.w3.org/2000/svg', 'g'],
        transform: 'scale(0.04)',
        $nodes: [
          a({
            $tag: ['http://www.w3.org/2000/svg', 'path'],
            style: { fill: 'currentColor' },
            d: `M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z`,
          }),
        ],
      }),
    ],
  });

ax.extensions.report.field.controls.checkbox = function (r, options) {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-checkbox').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [r.checkbox(options), r.validation(options)],
    controlTagOptions
  );
};

ax.extensions.report.field.controls.checkboxes = function (r, options) {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-checkboxes').focus();
    },
    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [r.checkboxes(options), r.validation(options)],
    controlTagOptions
  );
};

ax.extensions.report.field.controls.hidden = (r, options = {}) => {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {},
    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](controlTagOptions);
};

ax.extensions.report.field.controls.output = function (r, options = {}) {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-output').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [r.output(options), r.validation(options)],
    controlTagOptions
  );
};

ax.extensions.report.field.controls.radios = function (r, options) {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-radios').focus();
    },
    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [r.radios(options), r.validation(options)],
    controlTagOptions
  );
};

ax.extensions.report.field.controls.select = function (r, options) {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-select').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [r.select(options), r.validation(options)],
    controlTagOptions
  );
};

ax.extensions.report.field.controls.string = function (r, options) {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-string').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [r.string(options), r.validation(options)],
    controlTagOptions
  );
};

ax.extensions.report.field.controls.text = (r, options = {}) => {
  let controlTagOptions = {
    $init: (el) => {
      setTimeout(el.$resize, 0);
    },

    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('textarea').focus();
    },
    $resize: (el) => () => {
      x.form.field.controls.textarea.resize(el, options);
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [r.text(options), r.validation(options)],
    controlTagOptions
  );
};

ax.extensions.form.field.controls.textarea.resize = function (
  control,
  options
) {
  if (options.resize) {
    let resize = options.resize;
    let textarea = control.$('textarea');
    textarea.style.resize = 'none';
    textarea.style.height = 'auto';
    let height = textarea.scrollHeight + 5;
    if (ax.is.number(resize)) {
      height = height > resize ? resize : height;
    } else if (ax.is.string(resize)) {
      if (resize.match(/^\d+-\d+$/)) {
        let range = resize.split('-');
        let min = Number(range[0]);
        let max = Number(range[1]);
        if (height < min) {
          height = min;
        } else if (height > max) {
          height = max;
        }
      } else if (resize.match(/^\d+$/)) {
        resize = Number(resize);
        height = height > resize ? resize : height;
      }
    }
    textarea.style.height = `${height}px`;
  }
};

}));
