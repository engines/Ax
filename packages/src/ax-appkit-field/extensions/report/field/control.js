ax.extensions.report.field.control = function (r, options = {}) {
  let controlFn = r.controls[options.as || 'output'];
  if (!controlFn) {
    throw new Error(`Report field factory does not support control '${options.as}'.`);
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
