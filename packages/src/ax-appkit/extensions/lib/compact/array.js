ax.extensions.lib.compact.array = function (array) {
  return array.map((value) => this(value)).filter((value) => value != null);
};
