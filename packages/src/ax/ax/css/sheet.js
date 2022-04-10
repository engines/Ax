ax.css.sheet = function (sheet, keys = []) {
  return [sheet]
    .flat(Infinity)
    .map((section) => {
      if (ax.is.string(section)) {
        return section;
      } else {
        return this.rulesets(section, keys);
      }
    })
    .join(' ');
};
