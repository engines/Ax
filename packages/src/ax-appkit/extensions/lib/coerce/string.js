ax.extensions.lib.coerce.string = function (value) {
  return ax.is.undefined(value) ? '' : String(value);
};
