ax.extension.form.field.dependent.components.dependent.match = function (
  options
) {
  let field = options.field;

  if (field && field.$match()) {
    let fieldValue = field.$value();

    if (options.value) {
      return fieldValue === options.value;
    } else if (options.pattern) {
      return new RegExp(options.pattern || '.*').test(fieldValue.toString());
    } else if (ax.is.array(fieldValue)) {
      return fieldValue.length > 0;
    } else {
      return !!fieldValue;
    }
  } else {
    return false;
  }
};
