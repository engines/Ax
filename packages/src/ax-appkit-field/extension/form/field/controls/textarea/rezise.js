ax.extension.form.field.controls.textarea.resize = function (control, options) {
  if (options.resize) {
    let resize = options.resize;
    let textarea = control.$('textarea');
    textarea.style.resize = 'none';
    textarea.style.height = 'auto';
    let height = textarea.scrollHeight + 5;
    if (ax.is.number(resize)) {
      height = height > resize ? resize : height;
    } else if (ax.is.string(resize)) {
      if (resize.match(/^\d+-\d+$/)) {
        let range = resize.split('-');
        let min = Number(range[0]);
        let max = Number(range[1]);
        if (height < min) {
          height = min;
        } else if (height > max) {
          height = max;
        }
      } else if (resize.match(/^\d+$/)) {
        resize = Number(resize);
        height = height > resize ? resize : height;
      }
    }
    textarea.style.height = `${height}px`;
  }
};
