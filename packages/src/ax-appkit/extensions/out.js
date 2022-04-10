ax.extensions.out = function (value, options = {}) {
  let outTag = options.outTag || {};
  let component;

  if (ax.is.undefined(value)) {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  } else {
    if (options.parse) {
      if (ax.is.string(value)) {
        try {
          component = x.out.element(JSON.parse(value));
        } catch (error) {
          component = a['.error'](`⚠ ${error.message}`);
        }
      } else {
        component = a['.error'](`⚠ Not a string.`);
      }
    } else {
      component = x.out.element(value);
    }
  }

  return a['ax-appkit-out'](component, outTag);
};
