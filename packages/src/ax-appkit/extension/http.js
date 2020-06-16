ax.extension.http = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let singleRequest;
  let urls = options.url;

  if (ax.is.not.array(urls)) {
    singleRequest = true;
    urls = [urls];
  }
  let customCallbacks = options.when || {};

  let responsesSuccess = function (responses, el) {
    el.$send('ax.appkit.http.success');

    if (options.success) {
      Promise.all(
        responses.map((response) => contentPromiseFor(response))
      ).then((responses) => {
        if (singleRequest) {
          options.success.bind(el)(responses[0], el);
        } else {
          options.success.bind(el)(responses, el);
        }
      });
    } else {
      el.$nodes = responses.map((response) =>
        a['|appkit-http-response.success'](null, {
          $init: (el) => defaultContent(response, el),
        })
      );
    }
  };

  let responseError = (response, el) => {
    el.$send('ax.appkit.http.error');

    if (options.error) {
      options.error.bind(el)(response, el);
    } else {
      el.$nodes = a[`|appkit-http-response.error`](null, {
        $init: (el) => defaultContent(response, el),
      });
    }
  };

  let defaultContent = (response, el) => {
    let contentType = response.headers.get('content-type');

    if (contentType) {
      contentType = contentType.split(';')[0];

      let contentHandler = customCallbacks[contentType];

      if (contentHandler) {
        contentHandler.bind(el)(response, el);
      } else {
        el.$nodes = a({
          $init: componentFor(contentType, response),
        });
      }
    }
  };

  let contentPromiseFor = (response) => {
    let contentType = response.headers.get('content-type');

    if (contentType) {
      contentType = contentType.split(';')[0];
      if (contentType == 'application/json') {
        return response.json();
      } else {
        return response.text();
      }
    } else {
      return null;
    }
  };

  let componentFor = (contentType, response) => {
    if (contentType == 'application/json') {
      return (el) =>
        contentPromiseFor(response).then((content) => (el.$nodes = content));
    } else if (contentType == 'text/html') {
      return (el) =>
        contentPromiseFor(response).then((content) => (el.$html = content));
    } else if (contentType == 'text/plain') {
      return (el) =>
        contentPromiseFor(response).then(
          (content) => (el.$nodes = a.pre(content))
        );
    } else {
      return (el) =>
        contentPromiseFor(response).then((content) => (el.$text = content));
    }
  };

  return a['|appkit-http'](options.placeholder || null, {
    $init: (el) => {
      el.$send('ax.appkit.http.start');

      let optionFor = (key, i) => {
        if (ax.is.array(options[key])) {
          return options[key][i];
        } else {
          return options[key];
        }
      };

      Promise.all(
        urls.map((url, i) => {
          let query = optionFor('query', i);

          if (query) {
            url = `${url}?${x.lib.query.from.object(query)}`;
          }

          return fetch(url, {
            method: optionFor('method', i),
            headers: optionFor('headers', i),
            body: optionFor('body', i),
            ...optionFor('fetch', i),
          });
        })
      )
        .then((responses) => {
          let hadError;

          for (let i in responses) {
            let response = responses[i];

            if (response.status < 200 || response.status >= 300) {
              let statusErrorCallback = customCallbacks[response.status];

              if (statusErrorCallback) {
                statusErrorCallback.bind(el)(response, el);
              } else {
                responseError(response, el);
              }

              console.warn(
                `Received HTTP status ${response.status} when fetching ${
                  optionFor('method', i) || 'GET'
                } ${response.url}.`
              );

              hadError = true;
              break; // Exit promise on first error.
            }
          }

          if (!hadError) responsesSuccess(responses, el);
        })
        .catch((error) => {
          console.error('Ax appkit http error.', error.message, el);
          if (options.catch) options.catch(error, el);
        })
        .finally(() => {
          // el is ususally removed from DOM by callback,
          // so get parent for sending complete event and calling complete fn.
          let parent = el.$('^');
          if (options.complete) {
            options.complete.bind(parent)(parent);
          }
          // Parent sometimes removed too, by complete fn,
          // or when router navigates away.
          if (parent) parent.$send('ax.appkit.http.complete');
        });
    },
    ...options.httpTag,
  });
};
