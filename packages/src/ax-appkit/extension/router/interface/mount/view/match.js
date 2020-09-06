ax.extension.router.interface.mount.view.match = (routesKey, scopedpath) => {
  let params = {};
  let splat = [];
  let slash;

  let regexp = ax.x.router.interface.mount.view.match.regexp(routesKey);
  let routeRegex = new RegExp(regexp.string);
  let match = scopedpath.match(routeRegex);

  if (match) {
    let paramKeys = regexp.keys;
    let remove = 0;

    paramKeys.forEach(function (paramKey, i) {
      let matched = match[i + 1];
      if (paramKey === '*') {
        splat.unshift(matched);
      } else if (paramKey == '**') {
        remove = remove + matched.length;
        splat.unshift(matched);
      } else if (paramKey == '?') {
        remove = remove + matched.length;
        slash = matched;
      } else {
        params[paramKey] = matched;
      }
    });

    let keep = scopedpath.length - remove;
    let scope = scopedpath.substring(0, keep);

    return {
      params: params,
      splat: splat,
      slash: slash,
      scope: scope,
    };
  } else {
    return null;
  }
};
