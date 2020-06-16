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
