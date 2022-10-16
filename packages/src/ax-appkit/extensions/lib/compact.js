ax.extensions.lib.compact = function (value) {
  let compact = ax.x.lib.compact;

  if (ax.is.array(value)) {
    return compact.array(value);
  } else if (ax.is.object(value)) {
    return compact.object(value);
  } else if (['', undefined, null].includes(value)) {
    return null;
  } else {
    return value;
  }
};
