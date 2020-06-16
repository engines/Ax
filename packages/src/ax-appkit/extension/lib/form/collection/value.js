ax.extension.lib.form.collection.value = function (value) {
  if (ax.is.array(value)) {
    return value;
  } else if (value) {
    return [value];
  } else {
    return [];
  }
};
