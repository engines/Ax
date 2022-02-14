ax.css.rulesets = function (sheet, keys) {
  return Object.entries(sheet)
    .map(([key, value]) => {
      return key
        .split(',')
        .map((key) => {
          return this.ruleset([...keys, key], value);
        })
        .join(' ');
    })
    .join(' ');
};
