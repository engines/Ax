// Ax, copyright (c) Lachlan Douglas
// Distributed under an MIT license: https://github.com/engines/Ax/LICENSE.md
;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.ax = factory();
  }
}(this, function() {

/**
 * Creates an HTML element and inserts it in the DOM.
 * The target for the insertion is the document.body, unless options.target
 * specifies otherwise. options.target can be a selector string or an element.
 * The default insertion method is to append a child. Set options.method
 * 'replaceWith' to replace the target, or 'prependChild' to prepend a child.
 */
let ax = function (component, options = {}) {
  let element = ax.node(component);
  let insert = () => ax.insert(element, options);

  // Ensure that the document is ready to write to.
  if (
    window.document.readyState == 'interactive' ||
    window.document.readyState == 'complete'
  ) {
    insert();
  } else {
    window.document.addEventListener('DOMContentLoaded', insert);
  }

  return element;
};

/**
 * Process style definitions.
 */
ax.css = function (...styles) {
  return styles
    .map((style) => {
      if (ax.is.string(style)) {
        return style;
      } else if (ax.is.array(style)) {
        return ax.css(style);
      } else {
        return ax.css.rules(style);
      }
    })
    .join('');
};

/**
 * Extension loader.
 * Use this method to load Ax Extensions that are are imported as ES6 modules.
 * For example:
 * import ax from '@engines/ax'
 * import axCore from '@engines/ax-appkit-core'
 * import axChartjs from '@engines/ax-appkit-chartjs'
 * import "chart.js/dist/Chart.css";
 * import Chart from 'chart.js';
 * ax.extend( axCore, [axChartjs, {Chart: Chart}] ).
 */
ax.extend = function () {
  for (let extension of arguments) {
    if (ax.is.array(extension)) {
      extension[0].extend(this, extension[1] || {});
    } else {
      extension.extend(this);
    }
  }
};

/**
 * Extension namespace.
 * Extensions are installed here.
 */
ax.extension = {
  lib: {},
};

/**
 * Inserts an element in the DOM.
 */
ax.insert = function (element, options = {}) {
  let target = options.target;
  if (ax.is.string(target)) {
    target = window.document.querySelector(target);
  } else if (ax.is.undefined(target)) {
    target = window.document.body;
  }
  let method = options.method || 'appendChild';
  target[method](element);
};

/**
 * Check value is of a data type.
 */
ax.is = {};

/**
 * Convert string from camelCase to kebab-case.
 */
ax.kebab = (string) =>
  (string[0].match(/[A-Z]/) ? '-' : '') +
  string.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

/**
 * Creates a <link> tag in <head>.
 */
ax.link = function (attributes = {}) {
  ax.insert(
    ax.node.create({
      $tag: 'link',
      ...attributes,
    }),
    {
      target: 'head',
    }
  );
};

/**
 * Node pre-processor that accepts various component types
 * and returns a node.
 */
ax.node = function (component) {
  if (ax.is.null(component)) return null;
  if (ax.is.node(component)) return component;
  if (ax.is.nodelist(component)) return ax.node.nodelist(component);
  if (ax.is.array(component)) return ax.node.array(component);
  if (ax.is.object(component)) return ax.node.object(component);
  if (ax.is.tag(component)) return ax.node.tag(component);
  if (ax.is.function(component)) return ax.node.function(component);
  if (ax.is.undefined(component)) return ax.node.undefined();
  return ax.node.text(component);
};

/**
 * Creates a <script> tag in <head>.
 */
ax.script = function (attributes = {}) {
  ax.insert(
    ax.node.create({
      $tag: 'script',
      ...attributes,
    }),
    {
      target: 'head',
    }
  );
};

/**
 * Creates a <style> tag in <head> and inserts styles.
 * styles can be a string or an object.
 */
ax.style = function (...styles) {
  ax.insert(
    ax.node.create({
      $tag: 'style',
      $html: this.css(...styles),
    }),
    {
      target: 'head',
    }
  );
};

/**
 * Tag Builder namespace.
 * The Tag Builder creates arbitrary HTML elements.
 * It is instantiated as `ax.a`.
 */
ax.tag = {};

/**
 * Throw an error.
 */
ax.throw = function (...args) {
  throw new Error(args);
};

/**
 * Convert Ax Style Definitions to css style rules.
 */
ax.css.rules = function (styles, selectors = []) {
  if (selectors[0] && selectors[0][0] == '@') {
    return ax.css.rules.at(styles, selectors);
  } else if (ax.is.object(styles)) {
    return ax.css.rules.object(styles, selectors);
  } else {
    return '';
  }
};

/**
 * Alias for shortcut to Ax Extensions.
 */
ax.x = ax.extension;

/**
 * Determines whether value is an array.
 */
ax.is.array = function (value) {
  return value instanceof Array;
};

/**
 * Determines whether value is boolean.
 */
ax.is.boolean = function (value) {
  return typeof value === 'boolean';
};

/**
 * Determines whether value is a class.
 */
ax.is.class = function (value) {
  return this.function(value) && ('' + value).slice(0, 5) === 'class';
};

/**
 * Determines whether value is false.
 */
ax.is.false = function (value) {
  return value === false;
};

/**
 * Determines whether value is a function.
 */
ax.is.function = function (value) {
  return typeof value === 'function';
};

/**
 * Determines whether value is an HTML node.
 */
ax.is.node = function (value) {
  return value instanceof Node;
};

/**
 * Determines whether value is an HTML node list.
 */
ax.is.nodelist = function (value) {
  return value instanceof NodeList;
};

/**
 * Determines whether value is not a type.
 */
ax.is.not = new Proxy(
  {},
  {
    get: (target, property, receiver) => {
      if (ax.is.function(ax.is[property])) {
        return (value) => !ax.is[property](value);
      } else {
        console.error(`ax.is does not support .${property}()`);
      }
    },
  }
);

/**
 * Determines whether value is null.
 */
ax.is.null = function (value) {
  return value === null;
};

/**
 * Determines whether value is number.
 */
ax.is.number = function (value) {
  return typeof value === 'number';
};

/**
 * Determines whether value is an object.
 */
ax.is.object = function (value) {
  return value && value.constructor === Object;
};

/**
 * Determines whether value is a Promise.
 */
ax.is.promise = function (value) {
  return value instanceof Promise;
};

/**
 * Determines whether value is a string.
 */
ax.is.string = function (value) {
  return typeof value === 'string';
};

/**
 * Determines whether value is a Tag Builder Proxy function.
 */
ax.is.tag = function (value) {
  return '' + ax.a.tagProxyFunction === '' + value;
};

/**
 * Determines whether value is true.
 */
ax.is.true = function (value) {
  return value === true;
};

/**
 * Determines whether value is undefined.
 */
ax.is.undefined = function (value) {
  return value === void 0;
};

/**
 * Create element from an array of components.
 */
ax.node.array = function (array) {
  return ax.node.create({
    $nodes: array,
  });
};

/**
 * Create element from Ax component properties.
 */
ax.node.create = function (properties) {
  if (ax.is.not.object(properties)) return null;

  properties = {
    $tag: 'span',
    ...properties,
  };

  let element;

  if (ax.is.array(properties.$tag)) {
    element = window.document.createElementNS(...properties.$tag);
  } else {
    element = window.document.createElement(properties.$tag);
  }

  if (properties.$shadow) element.attachShadow({ mode: 'open' });

  element.$ax = properties;

  return ax.node.create.properties(element);
};

/**
 * Create element for a function.
 * Function is called with the Ax Tag Builder and Extensions.
 * The result, which can be any valid component, is fed back
 * into the Factory.
 */
ax.node.function = function (fn) {
  return ax.node(fn(ax.a, ax.x));
};

/**
 * Create element for a nodelist.
 */
ax.node.nodelist = function (nodelist) {
  return ax.node.create({
    $nodes: Array.from(nodelist),
  });
};

/**
 * Create element for an object.
 */
ax.node.object = function (object) {
  console.log(object);
  return ax.node.create({
    $tag: 'pre',
    $text: JSON.stringify(object, null, 2),
  });
};

/**
 * Creates elements from raw HTML.
 */
ax.node.raw = function (html) {
  let jig = window.document.createElement('div');
  jig.innerHTML = html;
  return jig.childNodes;
};

/**
 * Create element for an uncalled Tag Builder function.
 * e.g: a.br or a.hr
 */
ax.node.tag = (tag) => tag(null);

/**
 * Create element for text.
 */
ax.node.text = (text) => window.document.createTextNode(text);

/**
 * Create element for undefined content.
 */
ax.node.undefined = function () {
  let el = ax.node.text('UNDEFINED');
  console.warn('Component is undefined:', el);
  return el;
};

/**
 * Tag Builder proxy namespace.
 */
ax.tag.proxy = {};

/**
 * Handle @ rules.
 */
ax.css.rules.at = function (styleSpec, selectors) {
  let atRule = selectors.shift();
  let rules = this.rules(styleSpec, selectors);
  rules = '\t' + rules.split('\n').join('\n\t');
  return `${atRule} {\n${rules}\n}\n\n`;
};

/**
 * Convert an object containing Ax Style Definition to css style rules.
 */
ax.css.rules.object = function (styles, selectors = []) {
  let result = ax.css.rules.rule(styles, selectors);

  for (let selectorList of Object.keys(styles)) {
    let selected = styles[selectorList];
    for (let selector of selectorList.split(',')) {
      selector = selector.trim();
      selector = selector.replace(
        /\|([a-zA-Z0-9-_]+)/g,
        (match) => `[data-ax-pseudotag="${ax.kebab(match.replace(/^\|/, ''))}"]`
      );
      selector = selector.replace(/^([a-zA-Z0-9-_]+)/, (match) =>
        ax.kebab(match)
      );
      result += ax.css.rules(selected, selectors.concat(selector));
    }
  }

  return result;
};

/**
 * Convert Ax Style Definition to a css style rule.
 */
ax.css.rules.rule = function (object, selectors) {
  var result = '';
  for (let property of Object.keys(object)) {
    if (ax.is.not.object(object[property])) {
      result += '\t' + ax.kebab(property) + ': ' + object[property] + ';\n';
    }
  }
  if (result === '') return '';
  return selectors.join(' ').replace(/\s*&\s*/g, '') + ' {\n' + result + '}\n';
};

/**
 * Render active element, with reactive properties.
 */
ax.node.create.properties = function (element) {
  return this.properties.init(
    this.properties.apply(
      this.properties.render(
        this.properties.events(
          this.properties.accessors(
            this.properties.tools(
              this.properties.shadow(this.properties.define(element))
            )
          )
        )
      )
    )
  );
};

/**
 * Line-up the attributes for an element.
 */
ax.tag.proxy.attributes = function (property, attributes = {}) {
  // if the property starts with a word, use the word as nodename
  // if the property has a '|' word, use as pseudotag
  // if the property has a '#' word, use as id
  // if the property has '.' words, use as class
  // if the property has '[]' attrs, use as attributes
  // e.g. div#myTagId.btn.btn-primary

  if (ax.is.not.string(property)) {
    console.error('Expecting a string but got', property);
  }

  let nodename = (property.match(/^([\w-]+)/) || [])[1];
  let pseudotag = (property.match(/\|([\w-]+)/) || [])[1];
  let id = (property.match(/#([\w-]+)/) || [])[1];
  let classes = property.match(/\.[\w-]+/g) || [];
  let attrs = property.match(/\[.*?\]/g) || [];

  if (nodename) attributes.$tag = attributes.$tag || nodename;
  if (pseudotag) attributes.$pseudotag = attributes.$pseudotag || pseudotag;
  if (id) attributes.id = attributes.id || id;
  for (let klass of classes) {
    attributes.class = `${klass.replace('.', '')} ${
      attributes.class || ''
    }`.trim();
  }
  for (let attr of attrs) {
    let match = attr.match(/^\[([\w-]+)\=(.*)\]/);
    attributes[match[1]] = JSON.parse(match[2]);
  }
  return attributes;
};

/**
 * Set Ax content property based on component type.
 */
ax.tag.proxy.component = function (component) {
  if (ax.is.string(component))
    return {
      $text: component,
    };
  if (ax.is.array(component))
    return {
      $nodes: component,
    };
  if (ax.is.null(component)) return {};
  return {
    $nodes: [component],
  };
};

/**
 * Tag Builder proxy function.
 * Accepts an HTML fragment or an object of Ax component properties.
 * Returns an element.
 */
ax.tag.proxy.function = (arg) =>
  ax.is.object(arg) ? ax.node.create(arg) : ax.node.raw(arg);

/**
 * Tag Builder proxy shim.
 * Creates arbitrary HTML elements.
 */
ax.tag.proxy.shim = {
  get: (target, property) => (component, attributes) => {
    if (property == '!') return ax.node.raw(component);
    return ax.node.create({
      ...ax.tag.proxy.component(component),
      ...ax.tag.proxy.attributes(property, attributes || {}),
    });
  },
};

/**
 * Add methods to element.
 */
ax.node.create.properties.accessors = function (element) {
  return this.accessors.nodes(
    this.accessors.html(
      this.accessors.text(
        this.accessors.on(
          this.accessors.off(this.accessors.send(this.accessors.state(element)))
        )
      )
    )
  );
};

/**
 * Apply content to element.
 */
ax.node.create.properties.apply = function (element) {
  if (element.$ax.hasOwnProperty('$text')) {
    return this.render.text(element);
  } else if (element.$ax.hasOwnProperty('$nodes')) {
    return this.render.nodes(element);
  } else if (element.$ax.hasOwnProperty('$html')) {
    return this.render.html(element);
  } else {
    return element;
  }
};

/**
 * Set properties on element.
 */
ax.node.create.properties.define = function (element) {
  for (let property in element.$ax) {
    if (element.$ax.hasOwnProperty(property)) {
      if (property[0].match(/[a-zA-Z]/)) {
        let value = element.$ax[property];
        if (ax.is.not.undefined(value)) {
          if (property == 'style') {
            this.define.style(element, value);
          } else {
            this.define.attribute(element, property, value);
          }
        }
      } else if (property == '$pseudotag') {
        element.dataset.axPseudotag = element.$ax.$pseudotag;
      } else {
        if (
          !property.match(
            /^(\$tag|\$init|\$exit|\$text|\$nodes|\$html|\$state|\$send|\$on|\$off|\$update|\$render|\$ax|$events|\$|\$\$|\$shadow)$/
          )
        ) {
          let customAttribute = element.$ax[property];
          if (ax.is.function(customAttribute)) {
            element[property] = customAttribute(element);
          } else {
            element[property] = customAttribute;
          }
        }
      }
    }
  }

  return element;
};

/**
 * Add initial events to element.
 */
ax.node.create.properties.events = function (element) {
  element.$events = {};

  for (let handle in element.$ax.$on) {
    element.$events[handle] = element.$ax.$on[handle];
    element.addEventListener(handle.split(':')[0], (e) =>
      element.$events[handle](e, element)
    );
  }

  return element;
};

/**
 * Append init script to element.
 */
ax.node.create.properties.init = function (element) {
  if (ax.is.function(element.$ax.$init)) {
    element.appendChild(
      ax.node.create({
        $tag: 'script',
        type: 'text/javascript',
        $html:
          '(function(){' +
          'let script=window.document.currentScript;' +
          'let element=script.parentElement;' +
          'script.remove();' +
          'element.$ax.$init(element, element.$state);' +
          '})()',
      })
    );
  }

  return element;
};

/**
 * Add appropriate render function to element.
 */
ax.node.create.properties.render = function (element) {
  element.$render = () => {
    if (element.$ax.$update) {
      element.$ax.$update(element, element.$state) &&
        this.apply(this.render.empty(element));
    } else {
      this.apply(this.render.empty(element));
    }
    return element;
  };

  return element;
};

/**
 * Attach shadow DOM to element and insert styles.
 */
ax.node.create.properties.shadow = function (element) {
  if (element.$ax.$shadow) {
    if (ax.is.array(element.$ax.$shadow)) {
      for (let s of element.$ax.$shadow) {
        element.shadowRoot.appendChild(ax.a.style(ax.css(s)));
      }
    } else if (ax.is.not.true(element.$ax.$shadow)) {
      element.shadowRoot.appendChild(ax.a.style(ax.css(element.$ax.$shadow)));
    }
  }

  return element;
};

/**
 * Add traverse and query tools to element.
 */
ax.node.create.properties.tools = function (element) {
  element.$ = this.tools.traverse;
  element.$$ = this.tools.query;

  return element;
};

/**
 * Tag Builder proxy instantiation.
 */
ax.a = new Proxy(ax.tag.proxy.function, ax.tag.proxy.shim);

/**
 * Get HTML content, or set new HTML content.
 */
ax.node.create.properties.accessors.html = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$html', {
    get: function () {
      return element.innerHTML;
    },
    set: function (html) {
      accessors.html.set(element, html);
    },
  });

  return element;
};

/**
 * Get nodes content, or set new nodes content.
 */
ax.node.create.properties.accessors.nodes = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$nodes', {
    get: function () {
      return Array.from(element.childNodes);
    },
    set: function (nodes) {
      accessors.nodes.set(element, nodes);
    },
  });

  return element;
};

/**
 * Remove an event listener.
 */
ax.node.create.properties.accessors.off = function (element) {
  element.$off = function (handle) {
    if (ax.is.array(handle)) {
      while (element.$events.length) {
        element.$off(handle[0]);
      }
    } else {
      element.removeEventListener(
        handle.split(':')[0],
        element.$events[handle]
      );
      delete element.$events[handle];
    }
  };

  return element;
};

/**
 * Add an event listener.
 */
ax.node.create.properties.accessors.on = function (element) {
  element.$on = function (handlers) {
    for (let handle in handlers) {
      element.$off(handle);
      element.$events[handle] = handlers[handle];
      element.addEventListener(handle.split(':')[0], (e) =>
        element.$events[handle](e, element)
      );
    }
  };

  return element;
};

/**
 * Send an event from the element.
 */
ax.node.create.properties.accessors.send = function (element) {
  element.$send = function (type, options = {}) {
    return element.dispatchEvent(
      new CustomEvent(type, {
        detail: options.detail || {},
        bubbles: options.bubbles == false ? false : true,
        cancelable: options.cancelable == false ? false : true,
      })
    );
  };

  return element;
};

/**
 * Get element state, or set element state.
 */
ax.node.create.properties.accessors.state = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$state', {
    get: () => element.$ax.$state,
    set: (state) => accessors.state.set(element, state),
  });

  return element;
};

/**
 * Get text content, or set new text content.
 */
ax.node.create.properties.accessors.text = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$text', {
    get: function () {
      return element.innerHTML;
    },
    set: function (text) {
      accessors.text.set(element, text);
    },
  });

  return element;
};

/**
 * Define attribute on element.
 */
ax.node.create.properties.define.attribute = function (element, key, value) {
  this.attribute.set(element, [key], value);
};

/**
 * Define style attribute on element, with style
 * being a string or an object.
 */
ax.node.create.properties.define.style = function (element, style) {
  if (ax.is.object(style)) {
    let result = '';
    for (let key of Object.keys(style)) {
      let kebab = ax.kebab(key);
      result += kebab + ': ' + style[key] + '; ';
    }
    element.setAttribute('style', result);
  } else {
    element.setAttribute('style', style);
  }
};

/**
 * Clear exisitng children from element.
 */
ax.node.create.properties.render.empty = function (element) {
  while (element.childNodes.length) {
    let child = element.lastChild;
    ax.node.create.properties.render.exit(child);
    child.remove();
  }

  return element;
};

/**
 * Recursive removal of event handlers and call of $exit functions.
 */
ax.node.create.properties.render.exit = function (element) {
  if (element.$ax && ax.is.function(element.$ax.$exit))
    element.$ax.$exit(element);

  for (let child of element.childNodes)
    ax.node.create.properties.render.exit(child);
};

/**
 * Add raw HTML to element.
 */
ax.node.create.properties.render.html = function (element) {
  // Get content for the element.
  let html = element.$ax.$html;

  if (ax.is.function(html)) {
    html = html(element, element.$state);
  }

  let root = element.shadowRoot || element;

  root.innerHTML = html;

  return element;
};

/**
 * Add child nodes to element.
 */
ax.node.create.properties.render.nodes = function (element) {
  // Get content for the element.
  let nodes = element.$ax.$nodes;

  if (ax.is.function(nodes)) {
    nodes = nodes(element, element.$state);
  }

  let root = element.shadowRoot || element;

  // Add content
  if (ax.is.array(nodes)) {
    nodes.forEach(function (node) {
      node = ax.node(node);
      if (node != null && node.tagName != '_') root.appendChild(node);
    });
  } else {
    let node = ax.node(nodes);
    if (node != null && node.tagName != '_') root.appendChild(node);
  }

  return element;
};

/**
 * Add text to element.
 */
ax.node.create.properties.render.text = function (element) {
  // Get content for the element.
  let text = element.$ax.$text;

  // Resolve content function, if there is one.
  if (ax.is.function(text)) {
    text = text(element, element.$state);
  }

  let root = element.shadowRoot || element;

  // Add new content
  root.appendChild(window.document.createTextNode(text));

  return element;
};

/**
 * Query Tool, for collecting and operating on groups of elements.
 */
ax.node.create.properties.tools.query = function (selector) {
  selector = selector.replace(/\|([\w\-]+)/g, '[data-ax-pseudotag="$1"]');

  let collection = Array.from(this.querySelectorAll(selector));

  return ax.node.create.properties.tools.query.proxy(collection);
};

/**
 * Traverse Tool, for traversing the DOM.
 */
ax.node.create.properties.tools.traverse = function (...selectors) {
  let result = this;
  let traverse = ax.node.create.properties.tools.traverse;
  selectors.forEach(function (selector) {
    if (ax.is.array(selector)) {
      result = result.$(...selector);
    } else if (/,\s*/.test(selector)) {
      // comma is OR
      let selectors = selector.split(/,\s*/);
      let selected;
      for (let i in selectors) {
        selected = traverse.select(result, selectors[i]);
        if (selected) break;
      }
      result = selected;
    } else if (/^\S+$/.test(selector)) {
      // string contains a single selector
      result = traverse.select(result, selector);
    } else {
      // string contains multiple selectors
      selectors = selector.match(/(\S+)/g);
      result = result.$(...selectors);
    }
  });
  return result;
};

/**
 * Render html content.
 */
ax.node.create.properties.accessors.html.set = function (element, html) {
  delete element.$ax.$text;
  delete element.$ax.$nodes;
  element.$ax.$html = html;
  ax.node.create.properties.render.empty(element);
  ax.node.create.properties.render.html(element);

  return element;
};

/**
 * Render nodes content.
 */
ax.node.create.properties.accessors.nodes.set = function (element, nodes) {
  delete element.$ax.$text;
  delete element.$ax.$html;
  element.$ax.$nodes = nodes;
  ax.node.create.properties.render.empty(element);
  ax.node.create.properties.render.nodes(element);

  return element;
};

/**
 * Update state and render new content.
 */
ax.node.create.properties.accessors.state.set = function (element, state) {
  element.$ax.$state = state;
  element.$render();

  return element;
};

/**
 * Render text content.
 */
ax.node.create.properties.accessors.text.set = function (element, text) {
  delete element.$ax.$html;
  delete element.$ax.$nodes;
  element.$ax.$text = text;
  ax.node.create.properties.render.empty(element);
  ax.node.create.properties.render.text(element);

  return element;
};

/**
 * Make a data attribute from a string or object.
 */
ax.node.create.properties.define.attribute.set = function (
  element,
  keys,
  value
) {
  const define = ax.node.create.properties.define;
  if (value && ax.is.object(value)) {
    for (let key of Object.keys(value)) {
      let kebab = ax.kebab(key);
      define.attribute.set(element, keys.concat(key), value[key]);
    }
  } else {
    let kebab = keys.join('-');
    element.setAttribute(kebab, value);
  }
};

/**
 * Instantiate the Query Tool proxy.
 */
ax.node.create.properties.tools.query.proxy = function (
  collection,
  pending = []
) {
  return new Proxy(function () {}, this.proxy.shim(collection, pending));
};

/**
 * Select an element based on traversal instruction.
 */
ax.node.create.properties.tools.traverse.select = function (element, selector) {
  selector = selector.replace(/\|([\w\-]+)/g, '[data-ax-pseudotag="$1"]');
  if (!element) {
    return null;
  } else if (/^\s*\^/.test(selector)) {
    selector = selector.replace(/^\s*\^\s*/, '');
    if (selector) {
      return element.closest(selector);
    } else {
      return element.parentElement;
    }
  } else if (/^\s*$/.test(selector)) {
    return element;
  } else {
    return element.querySelector(selector);
  }
};

/**
 * Query Tool shim.
 */
ax.node.create.properties.tools.query.proxy.shim = function (
  collection,
  pending
) {
  return {
    get: ax.node.create.properties.tools.query.proxy.shim.get(
      collection,
      pending
    ),
    set: ax.node.create.properties.tools.query.proxy.shim.set(
      collection,
      pending
    ),
    apply: ax.node.create.properties.tools.query.proxy.shim.apply(
      collection,
      pending
    ),
  };
};

/**
 * Apply a function to selected elements.
 */
ax.node.create.properties.tools.query.proxy.shim.apply = function (
  collection,
  pending
) {
  return function (target, receiver, args) {
    collection.forEach(function (node, i) {
      collection[i] = pending[i].call(node, ...args);
    });

    return ax.node.create.properties.tools.query.proxy(collection);
  };
};

/**
 * Get values from selected elements.
 */
ax.node.create.properties.tools.query.proxy.shim.get = function (
  collection,
  pending
) {
  return function (target, property, receiver) {
    if (/^\d+$/.test(property)) return collection[property];
    if (/^\$\$$/.test(property)) return collection;
    if (/^toArray$/.test(property)) return collection;
    if (/^forEach$/.test(property)) return (fn) => collection.forEach(fn);
    if (/^toString$/.test(property)) return () => collection.toString();

    collection.forEach(function (node, i) {
      let result = node[property];
      if (ax.is.undefined(result)) {
        console.error(`Ax query for '${property}' is undefined on:`, node);
      } else if (ax.is.function(result)) {
        pending[i] = result;
      } else {
        collection[i] = result;
      }
    });

    return ax.node.create.properties.tools.query.proxy(collection, pending);
  };
};

/**
 * Set a value on selected elements.
 */
ax.node.create.properties.tools.query.proxy.shim.set = function (
  collection,
  pending
) {
  return function (target, property, value, receiver) {
    collection.forEach(function (node) {
      node[property] = value;
    });

    return true;
  };
};

return ax;

}));
