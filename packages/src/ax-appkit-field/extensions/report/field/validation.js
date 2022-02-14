ax.extensions.report.field.validation = function (options = {}) {
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
