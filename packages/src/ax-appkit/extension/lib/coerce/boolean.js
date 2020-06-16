ax.extension.lib.coerce.boolean = function (value) {
  value = value || false;
  let string = value.toString().toLowerCase();
  return value && string !== 'false' && string !== 'off' && string !== '0';
};
