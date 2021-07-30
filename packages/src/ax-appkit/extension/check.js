ax.extension.check = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let inputId =
    x.lib.object.dig(options, ['inputTag', 'id']) || x.lib.uuid.generate();

  let checkedValue = options.checked || 'on';

  let inputTagOptions = {
    type: options.type || 'checkbox',
    name: options.name,
    value: checkedValue,
    required: options.required,
    onclick: options.readonly ? 'return false' : 'return true',
    checked: options.value == checkedValue ? 'checked' : undefined,
    ...options.inputTag,
    id: inputId,
  };

  let labelTagOptions = {
    for: inputId,
    ...options.labelTag,
  };

  return a['ax-appkit-check'](
    [
      a.input(null, inputTagOptions),
      a.label(options.label || '', labelTagOptions),
    ],
    options.checkTag
  );
};
