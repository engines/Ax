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
