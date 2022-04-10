ax.extensions.table = (options = {}) => (a, x) => {
  const header = options.header || [];
  const data = options.data || [];
  const tableTag = options.tableTag || {};
  const theadTag = options.theadTag || {};
  const tbodyTag = options.tbodyTag || {};
  const thTag = { scope: 'col', ...options.thTag };
  const trTag = options.trTag || {};
  const tdTag = options.tdTag || {};

  let tbodyNodes = [];
  let tableNodes = [];

  if (header) {
    tableNodes.push(
      a.thead(
        a.tr(
          data.shift().map((thNodes) => a.th(thNodes, thTag)),
          trTag
        ),
        theadTag
      )
    );
  }

  for (let row of data) {
    tbodyNodes.push(
      a.tr(
        row.map((tdNodes) => a.td(tdNodes, tdTag)),
        trTag
      )
    );
  }

  tableNodes.push(a.tbody(tbodyNodes, tbodyTag));

  return a.table(tableNodes, tableTag);
};
