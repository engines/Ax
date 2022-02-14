ax.extensions.report.factory.report = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let report = options.report || (() => '');

  let reportTagOptions = {
    ...options.reportTag,
  };

  return a['ax-appkit-report'](report(r), reportTagOptions);
};
