ax.extensions.lib.text.labelize = function (string = '') {
  return this.capitalize(this.humanize(string));
};
