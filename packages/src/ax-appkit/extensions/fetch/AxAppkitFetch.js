ax.AxAppkitFetch = class {
  constructor(options = {}) {
    this.fetchCount = this.determineFetchCount(options);
    this.multiple = this.isMultiple(options);
    this.url = options.url;
    this.method = options.method;
    this.query = options.query;
    this.headers = options.headers;
    this.body = options.body;
    this.placeholder = options.placeholder || '';
    this.fetchTag = options.fetchTag || {};
    this.preprocessWhen = options.when || {};
    this.successCallback = options.success;
    this.errorCallback = options.error;
    this.catchCallback = options.catch;
    this.completeCallback = options.complete;
  }

  determineFetchCount(options) {
    return Math.max(
      ...['url', 'method', 'query', 'method', 'headers', 'body'].map((key) =>
        ax.is.array(options[key]) ? options[key].length : 0
      )
    );
  }

  isMultiple(options) {
    return ['url', 'method', 'query', 'method', 'headers', 'body'].some((key) =>
      ax.is.array(options[key])
    );
  }

  render() {
    return ax.a['ax-appkit-fetch'](this.placeholder, {
      $init: (el) => {
        this.element = el;
        this.init();
      },
      ...this.fetchTag,
    });
  }

  init() {
    // No fetches when url is empty array.
    if (this.multiple && this.fetchCount == 0) {
      this.renderSuccessResult([]);
      this.callComplete();
      return;
    }
    this.performFetches()
      .then((responses) => this.buildResults(responses))
      .then((results) => this.preprocessResults(results))
      .then((results) => this.renderResults(results))
      .catch((error) => this.renderCatch(error))
      .finally(() => this.callComplete());
  }

  performFetches() {
    return Promise.all(
      [...Array(this.fetchCount || 1)].map((_, i) => {
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
    return ax.is.array(this[key]) ? this[key][i] : this[key];
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
      let body = this.multiple ? bodies : bodies[0];
      let response = this.multiple ? responses : responses[0];
      let node = this.errorCallback(body, this.element, response);
      this.element.$nodes = [node];
    } else {
      this.element.$nodes = [ax.a['ax-appkit-fetch-response.error'](bodies)];
    }
  }

  renderSuccessResult(results) {
    let bodies = results.map((result) => result.body);
    let responses = results.map((result) => result.response);
    let body = this.multiple ? bodies : bodies[0];
    if (this.successCallback) {
      let response = this.multiple ? responses : responses[0];
      try {
        let node = this.successCallback(body, this.element, response);
        this.element.$nodes = [node];
      } catch (err) {
        console.error(err);
        this.element.$nodes = [];
      }
    } else {
      this.element.$nodes = [
        ax.a['ax-appkit-fetch-response.success'](
          ax.a.pre(JSON.stringify(body, null, 2))
        )
      ];
    }
  }

  renderCatch(error) {
    console.error(error);
    if (this.catchCallback) {
      let node = this.catchCallback(error, this.element);
      this.element.$nodes = [node];
    } else {
      this.element.$nodes = [ax.a['ax-appkit-fetch-response.error'](
        a.pre(error.message)
      )];
    }
  }

  callComplete() {
    if (this.completeCallback) this.completeCallback(this.element);
  }
};
