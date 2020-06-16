ax.extension.report.field.components.control = function (r, options = {}) {
  let as = (options.as || '').split('/');
  let control = options.control || as[0] || 'output';
  let type = options.type || as[1];

  let controlFn = r.controls[control];
  if (!controlFn)
    ax.throw(`Report field factory does not support control '${control}'.`);

  let key = options.key || '';

  let name = options.name || (r.scope ? `${r.scope}[${key}]` : key);

  let object = r.object || {};

  if (key && ax.is.not.undefined(object[key])) {
    options.value = object[key];
  }

  let controlOptions = {
    ...options,
    name: name,
    type: type,
    ...options[control],
  };

  if (options.collection) {
    return this.collection(r, controlFn, controlOptions);
  } else {
    return controlFn(controlOptions);
  }
};
