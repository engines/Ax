ax.extension.report.field.dependent.components.dependent = function (options) {
  let a = ax.a;
  let x = ax.x;

  let optionsCollection = x.form.field.dependent.collect(options);

  let dependentTag = {
    $init: function () {
      this.$dependencies = optionsCollection.map((options) => ({
        field: x.report.field.dependent.components.dependent.dependency(
          this,
          options
        ),
        value: options.value,
        pattern: options.pattern,
      }));
      this.$check();
    },
    $hide: function () {
      this.style.display = 'none';
    },
    $show: function () {
      this.style.display = 'block';
    },
    $value: function () {
      return this.$('|appkit-report-control').$value();
    },
    $match: function () {
      if (ax.is.undefined(this.$matched)) {
        if (this.$dependencies.length) {
          for (let dependency of this.$dependencies) {
            if (x.form.field.dependent.components.dependent.match(dependency)) {
              this.$matched = true;
              return true;
            }
          }
          this.$matched = false;
          return false;
        } else {
          this.$matched = true;
          return true;
        }
      } else {
        return this.$matched;
      }
    },
    $check: function () {
      if (this.$match()) {
        this.$show();
      } else {
        this.$hide();
      }
    },
    ...options.dependentTag,
    style: {
      display: 'none',
      ...(options.dependentTag || {}).style,
    },
  };

  return a['|appkit-report-field-dependent'](options.body, dependentTag);
};
