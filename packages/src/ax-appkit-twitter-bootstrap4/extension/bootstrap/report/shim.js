ax.extension.bootstrap.report.shim = {
  field: (r, target) => (options = {}) => {
    let horizontal = ax.is.undefined(options.horizontal)
      ? r.reportOptions.horizontal
      : options.horizontal;

    let fieldTagClass, headerTagClass, bodyTagClass;

    if (
      options.as == 'one' ||
      options.as == 'many' ||
      options.as == 'table' ||
      options.as == 'nest'
    ) {
      fieldTagClass = 'd-block mb-0';
    } else if (options.as == 'hidden') {
      fieldTagClass = 'd-none';
    } else {
      fieldTagClass = 'd-block mb-1';
    }

    if (horizontal) {
      fieldTagClass = fieldTagClass + ' form-row';
      headerTagClass = 'd-inline-block align-top mt-2 col-sm-4';
      bodyTagClass = 'd-inline-block col-sm-8';
    } else {
      headerTagClass = '';
      bodyTagClass = '';
    }

    return target({
      ...options,
      fieldTag: {
        class: fieldTagClass,
        ...options.fieldTag,
      },
      headerTag: {
        class: headerTagClass,
        ...options.headerTag,
      },
      labelTag: {
        class: 'mb-0',
      },
      bodyTag: {
        class: bodyTagClass,
        ...options.bodyTag,
      },
      hintTag: {
        class: 'text-muted d-block',
        ...options.hintTag,
      },
      helpTag: {
        class: 'text-muted',
        ...options.helpTag,
      },
    });
  },

  button: (r, target) => (options = {}) =>
    target({
      ...options,
      buttonTag: {
        class: 'btn btn-secondary',
        ...options.buttonTag,
      },
    }),

  checkbox: (r, target) => (options = {}) =>
    target({
      ...options,
      checkTag: {
        class: `custom-control custom-checkbox ml-1`,
        ...options.checkTag,
      },
      inputTag: {
        class: 'custom-control-input',
        ...options.inputTag,
      },
      labelTag: {
        class: 'custom-control-label text-dark',
        ...options.labelTag,
      },
      checkboxTag: {
        class: 'form-control h-100',
        ...options.checkboxTag,
      },
    }),

  checkboxes: (r, target) => (options = {}) =>
    target({
      ...options,
      checkTag: {
        class: 'custom-control custom-checkbox ml-1',
        ...options.checkTag,
      },
      inputTag: {
        class: 'custom-control-input',
        ...options.inputTag,
      },
      labelTag: {
        class: 'custom-control-label text-dark',
        ...options.labelTag,
      },
      checkboxesTag: {
        class: 'form-control h-100',
        ...options.checkboxesTag,
      },
    }),

  radios: (r, target) => (options = {}) =>
    target({
      ...options,
      checkTag: {
        class: 'custom-control custom-radio ml-1',
        ...options.checkTag,
      },
      inputTag: {
        class: 'custom-control-input',
        ...options.inputTag,
      },
      labelTag: {
        class: 'custom-control-label text-dark',
        ...options.labelTag,
      },
      radiosTag: {
        class: 'form-control h-100',
        ...options.radiosTag,
      },
    }),

  string: (r, target) => (options = {}) =>
    target({
      ...options,
      stringTag: {
        class: 'form-control h-100 text-dark bg-white h-100',
        ...options.stringTag,
      },
    }),

  select: (r, target) => (options = {}) =>
    target({
      ...options,
      selectTag: {
        class: 'form-control h-100 text-dark bg-white',
        ...options.selectTag,
      },
    }),

  text: (r, target) => (options = {}) =>
    target({
      ...options,
      textareaTag: {
        class: 'form-control text-dark bg-white',
        ...options.textareaTag,
      },
    }),

  output: (r, target) => (options = {}) =>
    target({
      ...options,
      outputTag: {
        class: 'form-control h-100 text-dark bg-white',
        ...options.outputTag,
      },
    }),

  control: (f, target) => (options = {}) => {
    if (options.collection) {
      return target({
        ...options,
        itemsTag: {
          class: 'mb-1 d-block',
          ...options.itemsTag,
        },
        itemTag: {
          class: 'clearfix d-block mb-1',
          ...options.itemTag,
        },
      });
    } else {
      return target(options);
    }
  },

  controls: {
    boolean: (r, target) => (options = {}) =>
      target({
        ...options,
        booleanTag: {
          class: 'form-control text-dark bg-white',
          ...options.booleanTag,
        },
      }),

    json: (r, target) => (options = {}) =>
      target({
        ...options,
        preTag: {
          class: 'form-control h-100 mb-0 text-dark bg-white',
          ...options.preTag,
        },
      }),

    preformatted: (r, target) => (options = {}) =>
      target({
        ...options,
        preTag: {
          class: 'form-control h-100 mb-0 text-dark bg-white',
          ...options.preTag,
        },
      }),

    password: (r, target) => (options = {}) =>
      target({
        ...options,
        passwordTag: {
          class: 'form-control text-dark bg-white',
          ...options.passwordTag,
        },
      }),

    color: (r, target) => (options = {}) =>
      target({
        ...options,
        colorTag: {
          class: 'form-control text-dark bg-white',
          ...options.colorTag,
        },
      }),

    datetime: (r, target) => (options = {}) =>
      target({
        ...options,
        datetimeTag: {
          class: 'form-control text-dark bg-white',
          ...options.datetimeTag,
        },
      }),

    number: (r, target) => (options = {}) =>
      target({
        ...options,
        numberTag: {
          class: 'form-control text-dark bg-white',
          ...options.numberTag,
        },
      }),

    tel: (r, target) => (options = {}) =>
      target({
        ...options,
        telTag: {
          class: 'form-control text-dark bg-white',
          ...options.telTag,
        },
      }),

    email: (r, target) => (options = {}) =>
      target({
        ...options,
        emailTag: {
          class: 'form-control text-dark bg-white',
          ...options.emailTag,
        },
      }),

    country: (r, target) => (options = {}) =>
      target({
        ...options,
        countryTag: {
          class: 'form-control text-dark bg-white',
          ...options.countryTag,
        },
      }),

    language: (r, target) => (options = {}) =>
      target({
        ...options,
        languageTag: {
          class: 'form-control text-dark bg-white',
          ...options.languageTag,
        },
      }),

    timezone: (r, target) => (options = {}) =>
      target({
        ...options,
        timezoneTag: {
          class: 'form-control text-dark bg-white',
          ...options.timezoneTag,
        },
      }),

    url: (r, target) => (options = {}) =>
      target({
        ...options,
        urlTag: {
          class: 'form-control text-dark bg-white',
          ...options.urlTag,
        },
      }),

    table: (r, target) => (options = {}) =>
      target({
        ...options,
        wrapperTag: {
          class: 'd-block',
          ...options.wrapperTag,
          style: {
            width: 'calc(100% + 0.25rem)',
            ...(options.wrapperTag || {}).style,
          },
        },
        tableTag: {
          class: 'table table-sm table-borderless mb-0',
          ...options.tableTag,
        },
        helpTdTag: {
          class: 'pl-1 pt-0 pr-0 pb-0',
          ...options.helpTdTag,
        },
        thTag: {
          class: 'py-0',
          ...options.thTag,
        },
        tdTag: {
          class: 'pl-1 pt-0 pr-0 pb-1',
          ...options.tdTag,
        },
        hintTdTag: {
          class: 'pl-1 pt-0 pr-0 pb-0',
          ...options.hintTdTag,
        },
      }),
  },

  submit: (r, target) => (options = {}) =>
    target({
      ...options,
      buttonTag: {
        class: 'btn btn-primary',
        ...options.buttonTag,
      },
    }),
};
