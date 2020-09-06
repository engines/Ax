ax.extension.form.field.nest.components.nest = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let nestForm = options.form || (() => null);
  console.log('nest opts', options);
  let ff = this.nest.factory({
    scope: options.name, // name is the scope for child items
    object: options.value,
    singular: options.singular,
    unindexed: options.unindexed,
    formOptions: f.formOptions,
  });
  let rebasedName = function (name, scope, index) {
    let pattern = `^${scope.replace(/(\[|\])/g, '\\$1')}\\[\\d*\\](.*)$`;
    let regex = new RegExp(pattern);
    let match = name.match(regex);
    if (!match) return scope;
    let i = options.unindexed ? '' : index;
    return `${scope}[${i}]${match[1]}`;
  };

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
    $value: (el) => () => el.$('|ax-appkit-form-nest-items').$count(),
    $controls: (el) => () => {
      return x.lib.unnested(el, 'ax-appkit-form-control');
    },
    $buttons: (el) => () => {
      return el.$$('button').$$;
    },
    $disable: (el) => () => {
      let controls = [...el.$controls(), ...el.$buttons()];
      for (let i in controls) {
        controls[i].$disable && controls[i].$disable();
      }
    },
    $enable: (el) => () => {
      let controls = [...el.$controls(), ...el.$buttons()];
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
