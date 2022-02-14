ax.css.sheet = function (sheets, keys = []) {
  return sheets
    .flat(Infinity)
    .map((sheet) => {
      if (ax.is.string(sheet)) {
        return sheet;
      } else {
        return this.rulesets(sheet, keys);
      }
    })
    .join(' ');
};
