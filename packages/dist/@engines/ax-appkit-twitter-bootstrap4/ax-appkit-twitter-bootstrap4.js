// Ax, copyright (c) Lachlan Douglas
// Distributed under an MIT license: https://github.com/engines/Ax/LICENSE.md
;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = {
      extend: (ax, dependencies={}) => factory(ax, dependencies)
    };
  } else {
    factory(root.ax)
  }
}(this, function(ax, dependencies={}) {

ax.extension.bootstrap = {};

ax.style({
  'ax-appkit-control-collection-item-body': {
    width: 'calc( 100% - 120px)',
  },
  'ax-appkit-report': {
    '.form-control': {
      border: 'none',
    },
  },
});

ax.extension.bootstrap.form = {};

ax.extension.bootstrap.report = {};

ax.extension.bootstrap.form.shim = {
  field: (f, target) => {
    return (options = {}) => {
      let horizontal = ax.is.undefined(options.horizontal)
        ? f.formOptions.horizontal
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
    };
  },

  fieldset: (f, target) => (options = {}) => {
    let horizontal = ax.is.undefined(options.horizontal)
      ? f.formOptions.horizontal
      : options.horizontal;

    let fieldsetTagClass, headerTagClass, bodyTagClass;

    if (horizontal) {
      fieldsetTagClass = 'mb-0 form-row';
      headerTagClass = 'd-inline-block align-top mt-2 col-sm-4';
      bodyTagClass = 'd-inline-block col-sm-8';
    } else {
      fieldsetTagClass = '';
      headerTagClass = '';
      bodyTagClass = '';
    }

    return target({
      ...options,
      fieldsetTag: {
        class: fieldsetTagClass,
        ...options.fieldTag,
      },
      headerTag: {
        class: headerTagClass,
        ...options.headerTag,
      },
      bodyTag: {
        class: bodyTagClass,
        ...options.bodyTag,
      },
      hintTag: {
        class: 'form-text text-muted',
        ...options.hintTag,
      },
    });
  },

  button: (f, target) => (options = {}) =>
    target({
      ...options,
      buttonTag: {
        class: 'btn btn-secondary',
        ...options.buttonTag,
      },
    }),

  checkbox: (f, target) => (options = {}) =>
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

  checkboxes: (f, target) => (options = {}) =>
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

  radios: (f, target) => (options = {}) =>
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

  input: (f, target) => (options = {}) =>
    target({
      ...options,
      inputTag: {
        class: 'form-control',
        ...options.inputTag,
      },
    }),

  select: (f, target) => (options = {}) =>
    target({
      ...options,
      selectTag: {
        class: 'custom-select',
        ...options.selectTag,
      },
    }),

  textarea: (f, target) => (options = {}) =>
    target({
      ...options,
      textareaTag: {
        class: 'form-control',
        ...options.textareaTag,
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
        itemHeaderTag: {
          class: 'd-inline-block float-right',
          ...options.itemHeaderTag,
        },
        itemButtonsTag: {
          class: 'btn-group',
          ...options.itemButtonsTag,
        },
        itemBodyTag: {
          class: 'd-inline-block float-left',
          ...options.itemBodyTag,
        },
        footerTag: {
          class: 'mb-1 d-block',
          ...options.footerTag,
        },
        dragButtonsTag: {
          class: 'float-right',
          ...options.dragButtonsTag,
        },
      });
    } else {
      return target(options);
    }
  },

  controls: {
    multiselect: (f, target) => (options = {}) =>
      target({
        ...options,
        controlTag: {
          class: 'form-control p-0 h-100',
          ...options.controlTag,
        },
        selectedTag: {
          class: 'd-block pl-2',
          ...options.selectedTag,
        },
        select: {
          ...options.select,
          selectTag: {
            class: 'custom-select border-0',
            ...(options.select || {}).selectTag,
          },
        },
      }),
    table: (f, target) => (options = {}) =>
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
          class: 'table table-sm table-borderless mb-0 ml-n1 mr-n1',
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
        itemButtonsTag: {
          class: 'btn-group float-right',
          ...options.itemButtonsTag,
        },
        footerTag: {
          class: 'mb-1 mt-0 d-block',
          ...options.footerTag,
        },
        dragButtonsTag: {
          class: 'float-right',
          ...options.dragButtonsTag,
        },
        dragOffButton: {
          ...options.dragOffButton,
          buttonTag: {
            class: 'btn btn-primary',
            ...(options.dragOffButton || {}).buttonTag,
          },
        },
        deleteTag: {
          class: 'btn btn-danger mr-1',
          ...options.deleteTag,
        },
      }),
    many: (f, target) => (options = {}) => {
      let horizontal = ax.is.undefined(options.horizontal)
        ? f.formOptions.horizontal
        : options.horizontal;

      return target({
        ...options,
        itemsTag: {
          class: 'mb-1 d-block',
          ...options.itemsTag,
        },
        itemHeaderTag: {
          class: 'clearfix',
          ...options.itemHeaderTag,
        },
        itemTitleTag: {
          class: 'float-left',
          ...options.itemTitleTag,
        },
        itemButtonsTag: {
          class: `btn-group float-right ${horizontal ? 'mb-1' : 'mb-0'}`,
          ...options.itemButtonsTag,
        },
        footerTag: {
          class: 'mb-1 d-block',
          ...options.footerTag,
        },
        dragButtonsTag: {
          class: 'float-right',
          ...options.dragButtonsTag,
        },
        dragOffButton: {
          ...options.dragOffButton,
          buttonTag: {
            class: 'btn btn-primary',
            ...(options.dragOffButton || {}).buttonTag,
          },
        },
        deleteTag: {
          class: 'btn btn-danger mr-1',
          ...options.deleteTag,
        },
        // upButton: {
        //   ...options.upButton,
        //   buttonTag: {
        //     class: 'btn',
        //     ...(options.upButton || {}).buttonTag,
        //   },
        // },
        // downButton: {
        //   ...options.downButton,
        //   buttonTag: {
        //     class: 'btn',
        //     ...(options.downButton || {}).buttonTag,
        //   },
        // },
        // removeButton: {
        //   ...options.removeButton,
        //   buttonTag: {
        //     class: 'btn',
        //     ...(options.removeButton || {}).buttonTag,
        //   },
        // },
      });
    },
    selectinput: (f, target) => (options = {}) =>
      target({
        ...options,
        input: {
          ...options.input,
          inputTag: {
            class: 'form-control mt-1',
            ...(options.input || {}).inputTag,
          },
        },
      }),
  },

  submit: (f, target) => (options = {}) =>
    target({
      ...options,
      buttonTag: {
        class: 'btn btn-primary',
        ...options.buttonTag,
      },
    }),
};

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
        class: 'form-control h-100 text-dark bg-transparent h-100',
        ...options.stringTag,
      },
    }),

  select: (r, target) => (options = {}) =>
    target({
      ...options,
      selectTag: {
        class: 'form-control h-100 text-dark bg-transparent',
        ...options.selectTag,
      },
    }),

  text: (r, target) => (options = {}) =>
    target({
      ...options,
      textareaTag: {
        class: 'form-control text-dark bg-transparent',
        ...options.textareaTag,
      },
    }),

  output: (r, target) => (options = {}) =>
    target({
      ...options,
      outputTag: {
        class: 'form-control h-100 text-dark bg-transparent',
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
          class: 'form-control text-dark bg-transparent',
          ...options.booleanTag,
        },
      }),

    json: (r, target) => (options = {}) =>
      target({
        ...options,
        preTag: {
          class: 'form-control h-100 mb-0 text-dark bg-transparent',
          ...options.preTag,
        },
      }),

    preformatted: (r, target) => (options = {}) =>
      target({
        ...options,
        preTag: {
          class: 'form-control h-100 mb-0 text-dark bg-transparent',
          ...options.preTag,
        },
      }),

    password: (r, target) => (options = {}) =>
      target({
        ...options,
        passwordTag: {
          class: 'form-control text-dark bg-transparent',
          ...options.passwordTag,
        },
      }),

    color: (r, target) => (options = {}) =>
      target({
        ...options,
        colorTag: {
          class: 'form-control text-dark bg-transparent',
          ...options.colorTag,
        },
      }),

    datetime: (r, target) => (options = {}) =>
      target({
        ...options,
        datetimeTag: {
          class: 'form-control text-dark bg-transparent',
          ...options.datetimeTag,
        },
      }),

    number: (r, target) => (options = {}) =>
      target({
        ...options,
        numberTag: {
          class: 'form-control text-dark bg-transparent',
          ...options.numberTag,
        },
      }),

    tel: (r, target) => (options = {}) =>
      target({
        ...options,
        telTag: {
          class: 'form-control text-dark bg-transparent',
          ...options.telTag,
        },
      }),

    email: (r, target) => (options = {}) =>
      target({
        ...options,
        emailTag: {
          class: 'form-control text-dark bg-transparent',
          ...options.emailTag,
        },
      }),

    country: (r, target) => (options = {}) =>
      target({
        ...options,
        countryTag: {
          class: 'form-control text-dark bg-transparent',
          ...options.countryTag,
        },
      }),

    language: (r, target) => (options = {}) =>
      target({
        ...options,
        languageTag: {
          class: 'form-control text-dark bg-transparent',
          ...options.languageTag,
        },
      }),

    timezone: (r, target) => (options = {}) =>
      target({
        ...options,
        timezoneTag: {
          class: 'form-control text-dark bg-transparent',
          ...options.timezoneTag,
        },
      }),

    url: (r, target) => (options = {}) =>
      target({
        ...options,
        urlTag: {
          class: 'form-control text-dark bg-transparent',
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

}));
