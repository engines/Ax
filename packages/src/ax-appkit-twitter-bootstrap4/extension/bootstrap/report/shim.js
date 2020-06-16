ax.extension.bootstrap.report.shim = {
  field: (r, target) => (options = {}) => {
    let vertical = ax.is.undefined(options.vertical)
      ? r.reportOptions.vertical
      : options.vertical;

    let fieldTagClass, headerTagClass, bodyTagClass;

    if (
      options.as == 'one' ||
      options.control == 'one' ||
      options.as == 'many' ||
      options.control == 'many' ||
      options.as == 'table' ||
      options.control == 'table' ||
      options.as == 'nest' ||
      options.control == 'nest'
    ) {
      fieldTagClass = 'd-block mb-0';
    } else if (options.as == 'hidden') {
      fieldTagClass = 'd-none';
    } else {
      fieldTagClass = 'd-block mb-1';
    }

    if (vertical) {
      headerTagClass = '';
      bodyTagClass = '';
    } else {
      fieldTagClass = fieldTagClass + ' form-row';
      headerTagClass = 'd-inline-block align-top mt-2 col-sm-4';
      bodyTagClass = 'd-inline-block col-sm-8';
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
        class: 'custom-control-label',
        ...options.labelTag,
      },
      checkboxTag: {
        class: 'd-block p-2',
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
        class: 'custom-control-label',
        ...options.labelTag,
      },
      checkboxesTag: {
        class: 'd-block p-2',
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
        class: 'custom-control-label',
        ...options.labelTag,
      },
      radiosTag: {
        class: 'd-block p-2',
        ...options.radiosTag,
      },
    }),

  string: (r, target) => (options = {}) =>
    target({
      ...options,
      stringTag: {
        class: 'form-control text-dark bg-white h-100',
        ...options.stringTag,
      },
    }),

  select: (r, target) => (options = {}) =>
    target({
      ...options,
      selectTag: {
        class: 'form-control text-dark h-100',
        ...options.selectTag,
      },
    }),

  text: (r, target) => (options = {}) =>
    target({
      ...options,
      textTag: {
        class: 'form-control text-dark bg-white h-100',
        ...options.textTag,
      },
    }),

  output: (r, target) => (options = {}) =>
    target({
      ...options,
      outputTag: {
        class: 'form-control text-dark bg-white h-100',
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
          class: 'form-control text-dark',
          ...options.booleanTag,
        },
      }),

    json: (r, target) => (options = {}) =>
      target({
        ...options,
        jsonTag: {
          class: 'form-control text-dark h-100',
          ...options.jsonTag,
        },
      }),

    preformatted: (r, target) => (options = {}) =>
      target({
        ...options,
        preformattedTag: {
          class: 'form-control text-dark bg-white h-100',
          ...options.preformattedTag,
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
          class: 'form-control text-dark',
          ...options.colorTag,
        },
      }),

    datetime: (r, target) => (options = {}) =>
      target({
        ...options,
        datetimeTag: {
          class: 'form-control text-dark',
          ...options.datetimeTag,
        },
      }),

    number: (r, target) => (options = {}) =>
      target({
        ...options,
        numberTag: {
          class: 'form-control text-dark',
          ...options.numberTag,
        },
      }),

    tel: (r, target) => (options = {}) =>
      target({
        ...options,
        telTag: {
          class: 'form-control text-dark',
          ...options.telTag,
        },
      }),

    email: (r, target) => (options = {}) =>
      target({
        ...options,
        emailTag: {
          class: 'form-control text-dark',
          ...options.emailTag,
        },
      }),

    country: (r, target) => (options = {}) =>
      target({
        ...options,
        countryTag: {
          class: 'form-control text-dark',
          ...options.countryTag,
        },
      }),

    language: (r, target) => (options = {}) =>
      target({
        ...options,
        languageTag: {
          class: 'form-control text-dark',
          ...options.languageTag,
        },
      }),

    timezone: (r, target) => (options = {}) =>
      target({
        ...options,
        timezoneTag: {
          class: 'form-control text-dark',
          ...options.timezoneTag,
        },
      }),

    url: (r, target) => (options = {}) =>
      target({
        ...options,
        urlTag: {
          class: 'form-control text-dark',
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
