ax.extension.report.factory.report = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let report = options.report || (() => null);

  let reportTagOptions = {
    ...options.reportTag,
  };

  return a['|appkit-report'](report(r), reportTagOptions);
};
