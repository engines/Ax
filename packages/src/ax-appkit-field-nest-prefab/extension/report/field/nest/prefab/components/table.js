ax.extension.report.field.nest.prefab.components.table = function (r, options) {
  let a = ax.a;

  return r.controls.nest({
    ...options,
    report: (rr) => (a, x) => {
      let report = options.report || (() => {});

      let tableHeader = function () {
        let rrP = new Proxy(rr, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                let label = ax.is.false(fieldOptions.label)
                  ? null
                  : fieldOptions.label || x.lib.text.labelize(fieldOptions.key);
                return a.th(
                  a['|appkit-report-field']([
                    label,
                    fieldOptions.help
                      ? r.helpbutton({
                          helpbuttonTag: {
                            $on: {
                              'click: toggle help': function () {
                                this.$state = !this.$state;
                                this.$(
                                  '^table',
                                  `|appkit-report-field-help[data-field-key="${fieldOptions.key}"]`
                                ).$toggle();
                              },
                            },
                          },
                        })
                      : null,
                  ]),
                  options.thTag
                );
              };
            } else {
              return a.td(null, options.tdTag); // empty cell
            }
          },
        });

        let headerCells = function () {
          let cells = report(rrP) || [];
          return cells;
        };

        return a.thead(a.tr(headerCells(), options.trTag), options.theadTag);
      };

      let tableHelp = function () {
        let rrP = new Proxy(rr, {
          get: (target, property) => {
            if (property === 'field') {
              return (fieldOptions) => {
                return a.td(
                  rr.help({
                    help: fieldOptions.help,
                    helpTag: {
                      ...options.helpTag,
                      'data-field-key': fieldOptions.key,
                    },
                  }),
                  options.helpTdTag
                );
              };
            } else {
              return a.td(null, options.helpTdTag); // empty cell
            }
          },
        });

        let helpCells = function () {
          let cells = report(rrP) || [];
          return cells;
        };

        return a.tr(helpCells(), options.helpTrTag);
      };

      let tableHint = function () {
        let rrP = new Proxy(rr, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                return a.td(
                  rr.hint({
                    hint: fieldOptions.hint,
                    hintTag: options.hintTag,
                  }),
                  options.hintTdTag
                );
              };
            } else {
              return a.td(null, options.hintTdTag); // empty cell
            }
          },
        });

        let hintCells = function () {
          let cells = report(rrP) || [];
          return cells;
        };

        return a.tr(hintCells(), options.hintTrTag);
      };

      let tableBody = () =>
        rr.items({
          ...options.items,
          report: (rrr) => {
            let rrrP = new Proxy(rrr, {
              get: (target, property) => {
                if (property == 'field') {
                  return (fieldOptions) => {
                    return a.td(rrr.control(fieldOptions), options.tdTag);
                  };
                } else {
                  return target[property];
                }
              },
            });

            let cells = report(rrrP);

            return cells;
          },
          itemsTag: {
            $tag: 'tbody',
            ...options.tbodyTag,
            ...options.itemsTag,
          },
          itemTag: {
            $tag: 'tr',
            ...options.trTag,
            ...options.itemTag,
          },
        });

      return a['|appkit-report-nest-table-wrapper'](
        [
          a.table(
            [tableHeader(), tableHelp(), tableBody(), tableHint()],
            options.tableTag
          ),
        ],
        options.wrapperTag
      );
    },
  });
};
