ax.extensions.router.interface.routes.view.match.regexp = (route) => {
  let routeRegexp = route
    .replace(/\*$/, '&&catchall&&')
    .replace(/\*/g, '&&wildcard&&')
    .replace(/\/\?/, '&&slash&&');

  let captures =
    routeRegexp.match(/(:\w+|&&wildcard&&|&&catchall&&|&&slash&&)/g) || [];
  let paramKeys = [];

  captures.forEach(function (capture) {
    let paramKey;
    let pattern;
    if (capture === '&&wildcard&&') {
      paramKey = '*';
      pattern = '([^/]*)';
    } else if (capture === '&&catchall&&') {
      paramKey = '**';
      pattern = '(.*)';
    } else if (capture === '&&slash&&') {
      paramKey = '?';
      pattern = '(\\/?)';
    } else {
      paramKey = capture.slice(1);
      pattern = '([^\\/]*)';
    }
    paramKeys.push(paramKey);
    routeRegexp = routeRegexp.replace(capture, pattern);
  });

  routeRegexp = '^' + routeRegexp + '$';

  return {
    string: routeRegexp,
    keys: paramKeys,
  };
};
