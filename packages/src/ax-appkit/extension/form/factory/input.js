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

  return a['|appkit-form-input-wrapper'](
    [a.input(null, inputTagOptions), datalist],
    options.wrapperTag
  );
};
