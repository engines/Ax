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

ax.extension.form.field = {};

ax.extension.report.field = {};

ax.extension.form.field.button = (target, options = {}) =>
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

ax.extension.form.field.collection = function (f, control, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let values = x.lib.form.collection.value(options.value);

  let itemFn = (value) =>
    a['ax-appkit-control-collection-item'](
      [
        a['ax-appkit-control-collection-item-header'](
          a['ax-appkit-control-collection-item-buttons'](
            [
              options.moveable
                ? this.collection.up(f, options.upButton || {})
                : null,
              options.moveable
                ? this.collection.down(f, options.downButton || {})
                : null,
              options.removeable
                ? this.collection.remove(f, {
                    singular: options.singular,
                    ...options.removeButton,
                  })
                : null,
            ],
            options.itemButtonsTag
          ),
          options.itemHeaderTag
        ),
        a['ax-appkit-control-collection-item-body'](
          control({
            ...options,
            name: `${options.name}[]`,
            value: value,
          }),
          options.itemBodyTag
        ),
      ],
      options.itemTag
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
          : null,
      ],
      options.collectionTag
    ),
    controlTagOptions
  );
};

ax.extension.form.field.control = function (f, options = {}) {
  let controlFn = f.controls[options.as || 'input'];
  if (!controlFn) {
    console.error(`Failed to create form field using options:`, options);
    ax.throw(`Form field factory does not support control '${options.as}'.`);
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
      $output: (el) => () =>
        options.digest ? options.digest(el.$value()) : el.$value(),
      ...(options.control || {}).controlTag,
    },
  };

  if (options.collection) {
    return this.collection(f, controlFn, controlOptions);
  } else {
    return controlFn(controlOptions);
  }
};

ax.extension.form.field.controls = {};

ax.extension.form.field.field = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

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
            label: null,
            labelTag: null,
          }),
          f.hint(options),
        ],
        options.bodyTag
      ),
    ],
    options.fieldTag
  );
};

ax.extension.form.field.fieldset = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let control = a[
    'ax-appkit-form-control.ax-appkit-form-control-without-value'
  ](
    [
      options.legend ? a.legend(options.legend, options.legendTag) : null,
      options.body || null,
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
          options.bodyTag
        ),
      ],
      options.fieldsetTag
    )
  );
};

ax.extension.form.field.header = function (f, options = {}) {
  let component;

  if (options.header == true) {
    options.header = null;
  } else if (options.header == false) {
    return null;
  }

  if (options.header) {
    component = header;
  } else {
    let caption = options.label === false ? null : f.label(options);
    if (options.help) {
      component = [caption, f.helpbutton(options)];
    } else {
      component = caption;
    }
  }

  return ax.a['ax-appkit-form-field-header'](component, options.headerTag);
};

ax.extension.form.field.help = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

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
        options.wrapperTag
      )
    : null;
};

ax.extension.form.field.helpbutton = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['ax-appkit-form-field-helpbutton'](null, {
    $state: false,
    $nodes: (el) => {
      let show = el.$state;
      return a['ax-appkit-form-field-helpbutton-text'](
        el.show ? ' ❓ ✖ ' : ' ❓ '
      );
    },
    ...options.helpbuttonTag,
    $on: {
      'click: toggle help': (e, el) => {
        el.$state = !el.$state;
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

ax.extension.form.field.hint = function (options = {}) {
  let a = ax.a;

  return options.hint
    ? a['ax-appkit-form-field-hint'](a.small(options.hint), options.hintTag)
    : a._;
};

ax.extension.form.field.label = function (options = {}) {
  let a = ax.a;
  let x = ax.x;
  let lib = x.lib;

  let label = options.label || lib.text.labelize(options.key);
  let component = a.label(label, options.labelTag);

  let wrapperTag = {
    ...options.wrapperTag,

    $on: {
      'click: focus on input': (e, el) => {
        let target = el.$('^ax-appkit-form-field ax-appkit-form-control');
        target.$focus();
      },
      ...(options.wrapperTag || {}).$on,
    },
  };

  return a['ax-appkit-form-field-label-wrapper'](component, wrapperTag);
};

ax.extension.form.field.shim = {
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

ax.extension.report.field.collection = function (f, control, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let values = x.lib.form.collection.value(options.value);

  let itemFn = (value) =>
    a['ax-appkit-control-collection-item'](
      [
        a['ax-appkit-control-collection-item-header'](
          null,
          options.itemHeaderTag
        ),
        a['ax-appkit-control-collection-item-body'](
          control({
            ...options,
            name: `${options.name}[]`,
            value: value,
          }),
          options.itemBodyTag
        ),
      ],
      options.itemTag
    );

  let components = values.map((value) => itemFn(value));

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-control-collection ax-appkit-report-control').$focus();
    },
    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    a['ax-appkit-control-collection'](
      [a['ax-appkit-control-collection-items'](components, options.itemsTag)],
      options.collectionTag
    ),
    controlTagOptions
  );
};

ax.extension.report.field.control = function (r, options = {}) {
  let controlFn = r.controls[options.as || 'output'];
  if (!controlFn) {
    console.error(`Failed to create report field using options:`, options);
    ax.throw(`Report field factory does not support control '${options.as}'.`);
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

ax.extension.report.field.controls = {};

ax.extension.report.field.field = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

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
            label: null,
            labelTag: null,
          }),
          r.hint(options),
        ],
        options.bodyTag
      ),
    ],
    options.fieldTag
  );
};

ax.extension.report.field.fieldset = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let control = a['ax-appkit-report-control'](
    [
      options.legend ? a.legend(options.legend, options.legendTag) : null,
      options.body || null,
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
          options.bodyTag
        ),
      ],
      options.fieldsetTag
    )
  );
};

ax.extension.report.field.header = function (r, options = {}) {
  if (options.type == 'hidden') {
    return null;
  } else {
    let component;

    if (options.header == true) {
      options.header = null;
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

    return ax.a['ax-appkit-report-field-header'](component, options.headerTag);
  }
};

ax.extension.report.field.help = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

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
        options.wrapperTag
      )
    : null;
};

ax.extension.report.field.helpbutton = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['ax-appkit-report-field-helpbutton'](null, {
    $state: false,
    $nodes: (el) => {
      return a['ax-appkit-report-field-helpbutton-text'](
        el.$state ? ' ❓ ✖ ' : ' ❓ '
      );
    },
    $on: {
      'click: toggle help': (e, el) => {
        el.$state = !el.$state;
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

ax.extension.report.field.hint = function (options = {}) {
  let a = ax.a;

  let hint = options.hint;

  return hint
    ? a['ax-appkit-report-field-hint'](a.small(hint), options.hintTag)
    : null;
};

ax.extension.report.field.label = function (options = {}) {
  let a = ax.a;
  let x = ax.x;
  let lib = x.lib;

  if (ax.is.false(options.label)) return null;
  let label = options.label || lib.text.labelize(options.key);
  if (!label) return null;
  let component = a.label(label, options.labelTag);

  let wrapperTag = {
    ...options.wrapperTag,

    $on: {
      'click: focus on output': (e, el) => {
        let target = el.$('^ax-appkit-report-field ax-appkit-report-control');
        target && target.$focus();
      },
      ...(options.wrapperTag || {}).$on,
    },
  };

  return a['ax-appkit-report-field-label-wrapper'](component, wrapperTag);
};

ax.extension.report.field.shim = {
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

ax.extension.report.field.validation = function (options = {}) {
  let a = ax.a;

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

  if (validity.valid) return null;

  if (ax.is.function(options.invalid)) {
    message = options.invalid(options.value, validity) || null;
  } else if (ax.is.string(options.invalid)) {
    message = options.invalid;
  } else if (!validity.valueMissing && options.controlInvalid) {
    message = options.controlInvalid;
  }

  return a['ax-appkit-report-field-validation.error'](
    a.small(message),
    options.validationTag
  );
};

ax.extension.form.field.collection.add = function (f, options) {
  let label = `✚ Add${options.singular ? ` ${options.singular}` : ''}`;

  return f.button({
    label: label,
    onclick: (e, el) => {
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

ax.extension.form.field.collection.down = function (f, options) {
  return f.button({
    label: '⏷',
    onclick: function (e, el) {
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

ax.extension.form.field.collection.remove = function (f, options) {
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
    label: '✖',
    confirm: confirmation,
    onclick: function (e, el) {
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

ax.extension.form.field.collection.up = function (f, options) {
  return f.button({
    label: '⏶',
    onclick: function (e, el) {
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

ax.extension.form.field.controls.checkbox = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    $init: (el) => {
      el.$valid();
    },

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
      'input: check validity': (e, el) => {
        el.$valid();
      },
      'input: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.checkbox(options), controlTagOptions);
};

ax.extension.form.field.controls.checkboxes = function (f, options) {
  let a = ax.a;

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
      'click: do nothing when readonly': (e, el) => {
        if (options.readonly) e.preventDefault();
      },
      'change: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.checkboxes(options), controlTagOptions);
};

ax.extension.form.field.controls.hidden = (f, options = {}) => {
  let a = ax.a;
  let x = ax.x;

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

ax.extension.form.field.controls.input = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    $init: (el) => {
      el.$valid();
    },

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
      if (el.$validity().valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(
              el.$value(),
              el.$validity(),
              el
            );
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
      'input: check validity': (e, el) => {
        el.$valid();
      },
      'input: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.input(options), controlTagOptions);
};

ax.extension.form.field.controls.radios = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    $init: (el) => {
      el.$valid();
    },

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
      'click: do nothing when readonly': (e, el) => {
        if (options.readonly) e.preventDefault();
      },
      'input: check validity': (e, el) => {
        el.$valid();
      },
      'change: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.radios(options), controlTagOptions);
};

ax.extension.form.field.controls.select = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    $init: (el) => {
      el.$valid();
    },

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
      'click: do nothing when readonly': (e, el) => {
        if (options.readonly) e.preventDefault();
      },
      'change: check validity': (e, el) => {
        el.$valid();
      },
      'change: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.select(options), controlTagOptions);
};

ax.extension.form.field.controls.textarea = (f, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    $init: (el) => {
      el.$valid();
      setTimeout(el.$resize, 0);
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
      'input: check validity': (e, el) => {
        el.$valid();
      },
      'input: send control change event and resize': (e, el) => {
        el.$send('ax.appkit.form.control.change');
        el.$resize();
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.textarea(options), controlTagOptions);
};

ax.extension.report.field.controls.checkbox = function (r, options) {
  let a = ax.a;

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

ax.extension.report.field.controls.checkboxes = function (r, options) {
  let a = ax.a;

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

ax.extension.report.field.controls.hidden = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {},
    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](null, controlTagOptions);
};

ax.extension.report.field.controls.output = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

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

ax.extension.report.field.controls.radios = function (r, options) {
  let a = ax.a;

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

ax.extension.report.field.controls.select = function (r, options) {
  let a = ax.a;

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

ax.extension.report.field.controls.string = function (r, options) {
  let a = ax.a;

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

ax.extension.report.field.controls.text = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

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

ax.extension.form.field.controls.textarea.resize = function (control, options) {
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
