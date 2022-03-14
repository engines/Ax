ax.extensions.lib.unnested = function (el, tag) {
  let controls = el.$$(tag).$$;
  let result = [];

  controls.forEach(function (el1, i) {
    let nested;
    controls.forEach(function (el2) {
      if (!el1.isSameNode(el2) && el2.contains(el1)) {
        nested = true;
      }
    });
    if (!nested) {
      result.push(el1);
    }
  });

  return result;
};
