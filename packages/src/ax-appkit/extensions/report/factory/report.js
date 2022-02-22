ax.extensions.report.factory.report = (r, options = {}) => {
  let report = options.report || (() => '');

  let reportTagOptions = {
    ...options.reportTag,
  };

  return a['ax-appkit-report'](report(r), reportTagOptions);
};
