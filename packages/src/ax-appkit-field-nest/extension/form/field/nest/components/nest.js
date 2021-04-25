ax.extension.form.field.nest.components.nest = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let nestForm = options.form || (() => null);
  let ff = this.nest.factory({
    scope: options.name, // name is the scope for child items
    object: options.value,
    singular: options.singular,
    formOptions: f.formOptions,
  });

  let nestTagOptions = {
    name: ff.scope,

    $rescope: (el) => (oldScope, newScope) => {
      let oldName = el.getAttribute('name');
      let newName = oldName.replace(oldScope, newScope);
      ff.scope = newName;
      el.setAttribute('name', newName);
      let rescopable = x.lib.unnested(el, `[name^="${oldName}"]`);
      rescopable.forEach((target) => {
        if (ax.is.function(target.$rescope)) {
          target.$rescope(oldName, newName);
        } else {
          target.setAttribute(
            'name',
            target.getAttribute('name').replace(oldName, newName)
          );
        }
      });
    },

    ...options.nestTag,
  };

  let controlTagOptions = {
    $value: (el) => () => {
      let controls = el.$controls();
      let object = {};
      for (let control of controls) {
        if (control.$ax.$pseudotag == 'ax-appkit-form-nest-items') {
          object = control.$value();
          break;
        }
        object[control.$key] = control.$value();
      }
      return object;
    },
    $controls: (el) => () => {
      return x.lib.unnested(
        el,
        'ax-appkit-form-control, |ax-appkit-form-nest-items'
      );
    },
    $disable: (el) => () => {
      let controls = el.$controls();
      for (let i in controls) {
        controls[i].$disable && controls[i].$disable();
      }
    },
    $enable: (el) => () => {
      let controls = el.$controls();
      for (let i in controls) {
        controls[i].$enable && controls[i].$enable();
      }
    },
    $focus: (el) => () => {
      let first = el.$('ax-appkit-form-control');
      if (first) first.$focus();
    },
    ...options.controlTag,
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-nest'](nestForm(ff), nestTagOptions),
    controlTagOptions
  );
};
