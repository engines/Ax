class AxAppkitFetch {
  constructor(options = {}) {
    this.multiple = this.determineMultiple(options);
    this.url = options.url;
    this.method = options.method;
    this.query = options.query;
    this.headers = options.headers;
    this.body = options.body;
    this.placeholder = options.placeholder || null;
    this.fetch = options.fetch || {};
    this.fetchTag = options.fetchTag || {};
    this.preprocessWhen = options.when || {};
    this.successCallback = options.success;
    this.errorCallback = options.error;
    this.catchCallback = options.catch;
    this.completeCallback = options.complete;
  }

  determineMultiple(options) {
    return Math.max(
      ...[
        'url',
        'method',
        'query',
        'method',
        'headers',
        'body',
        'fetch',
      ].map((key) => (is.array(options[key]) ? options[key].length : 0))
    );
  }

  render() {
    return a['ax-appkit-fetch'](this.placeholder, {
      $init: (el) => {
        this.element = el;
        this.init();
      },
      ...this.fetchTag,
    });
  }

  init() {
    this.performFetches()
      .then((responses) => this.buildResults(responses))
      .then((results) => this.preprocessResults(results))
      .then((results) => this.renderResults(results))
      .catch((error) => this.renderError(error))
      .finally(() => this.callComplete());
  }

  performFetches() {
    return Promise.all(
      [...Array(this.multiple || 1)].map((_, i) => {
        let url = this.propertyFor('url', i);
        let query = this.propertyFor('query', i);
        if (query) url = `${url}?${x.lib.query.stringify(query)}`;
        return this.fetchPromise(url, i);
      })
    );
  }

  fetchPromise(url, i) {
    return fetch(url, {
      method: this.propertyFor('method', i),
      headers: this.propertyFor('headers', i),
      body: this.propertyFor('body', i),
      ...this.propertyFor('fetch', i),
    });
  }

  propertyFor(key, i) {
    return is.array(this[key]) ? this[key][i] : this[key];
  }

  buildResults(responses) {
    return Promise.all(
      responses.map(
        (response) =>
          new Promise((resolve, reject) => {
            let contentType = this.contentTypeFor(response);
            this.contentPromise(response, contentType).then((body) =>
              resolve({
                body: body,
                response: response,
                status: response.status,
                contentType: contentType,
                error: response.status < 200 || response.status >= 300,
              })
            );
          })
      )
    );
  }

  contentTypeFor(response) {
    return (response.headers.get('content-type') || '').split(';')[0];
  }

  contentPromise(response, contentType) {
    return contentType == 'application/json'
      ? response.json()
      : response.text();
  }

  preprocessResults(results) {
    return new Promise((resolve, reject) => {
      resolve(this.applyPreprocessors(results));
    });
  }

  applyPreprocessors(results) {
    return results.map((result) => {
      let body = result.body;
      let response = result.response;
      let status = result.status;
      let contentType = result.contentType;
      if (this.preprocessWhen[status])
        body = this.preprocessWhen[status](body, this.element, response);
      if (this.preprocessWhen[contentType])
        body = this.preprocessWhen[contentType](body, this.element, response);
      result.body = body;
      return result;
    });
  }

  renderResults(results) {
    results.filter((result) => result.error).length
      ? this.renderErrorResult(results)
      : this.renderSuccessResult(results);
  }

  renderErrorResult(results) {
    results = results.filter((result) => result.error);
    let bodies = results.map((result) => result.body);
    let responses = results.map((result) => result.response);
    if (this.errorCallback) {
      if (this.multiple) {
        this.errorCallback(bodies, this.element, responses);
      } else {
        this.errorCallback(bodies[0], this.element, responses[0]);
      }
    } else {
      this.element.$nodes = a['ax-appkit-fetch-response.error'](bodies);
    }
  }

  renderSuccessResult(results) {
    let bodies = results.map((result) => result.body);
    let responses = results.map((result) => result.response);
    if (this.successCallback) {
      if (this.multiple) {
        this.successCallback(bodies, this.element, responses);
      } else {
        this.successCallback(bodies[0], this.element, responses[0]);
      }
    } else {
      this.element.$nodes = a['ax-appkit-fetch-response.success'](bodies);
    }
  }

  renderError(error) {
    console.error(error);
    if (this.catchCallback) {
      this.catchCallback(error, this.element);
    } else {
      this.element.$nodes = a['ax-appkit-fetch-response.error'](error.message);
    }
  }

  callComplete() {
    if (this.completeCallback) this.completeCallback(this.element);
  }
}
