ax.extension.form.field.control = function (f, options = {}) {
  let controlFn = f.controls[options.as || 'input'];
  if (!controlFn) {
    console.error(`Failed to create form field using options:`, options);
    ax.throw(`Form field factory does not support control '${options.as}'.`);
  }

  let key = options.key || '';

  let name = options.name || (f.scope ? `${f.scope}[${key}]` : key);

  let object = f.object || {};

  if (ax.is.not.undefined(object[key])) {
    options.value = object[key];
  }

  let controlOptions = {
    ...options,
    name: name,
    ...options.control,
  };

  if (options.collection) {
    return this.collection(f, controlFn, controlOptions);
  } else {
    return controlFn(controlOptions);
  }
};
