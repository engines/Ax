ax.extensions.check = function (options = {}) {
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
    $nodes: [options.label || ''],
    for: inputId,
    ...options.labelTag,
  };

  return a['ax-appkit-check'](
    [
      a.input(inputTagOptions),
      a.label(labelTagOptions),
    ],
    options.checkTag || {}
  );
};
