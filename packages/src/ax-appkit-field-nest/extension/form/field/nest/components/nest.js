ax.extension.form.field.nest.components.nest = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let nestForm = options.form || (() => null);
  let itemsTagName = options.itemsTagName || 'ax-appkit-form-nest-items';

  let ff = this.nest.factory({
    parent: f,
    scope: f.scope ? `${f.scope}[${options.key}]` : options.key,
    indexedScope:
      f.indexedScope || f.scope
        ? `${f.indexedScope || f.scope}[${options.key}]`
        : options.key,
    object: options.value,
    singular: options.singular,
    collection: options.collection,
    formOptions: f.formOptions,
  });

  let nestTagOptions = {
    name: ff.scope,

    $rescope: (el) => (
      oldScope,
      newScope,
      oldIndexedScope,
      newIndexedScope
    ) => {
      let oldName = oldScope ? `${oldScope}[${options.key}]` : options.key;
      let oldIndexedName =
        oldIndexedScope || oldScope
          ? `${oldIndexedScope || oldScope}[${options.key}]`
          : options.key;
      let newName = newScope ? `${newScope}[${options.key}]` : oldName;
      let newIndexedName = newIndexedScope
        ? `${newIndexedScope}[${options.key}]`
        : oldIndexedName;

      el.setAttribute('name', newName);
      ff.scope = newName;
      ff.indexedScope = newIndexedName;

      let rescopable = x.lib.unnested(
        el,
        `[name^="${oldName}"], [name^="${oldIndexedName}"]`
      );

      rescopable.forEach((target) => {
        if (ax.is.function(target.$rescope)) {
          target.$rescope(oldName, newName, oldIndexedName, newIndexedName);
        }
      });
    },

    ...options.nestTag,
  };

  let controlTagOptions = {
    $controls: (el) => () => {
      return x.lib.unnested(el, `ax-appkit-form-control, ${itemsTagName}`);
    },
    $value: (el) => () => {
      let controls = ax.x.lib
        .unnested(
          el,
          `ax-appkit-form-control:not(.ax-appkit-form-control-without-value), ${itemsTagName}`
        )
        .filter((control) => control.$enabled);
      let object = {};
      for (let control of controls) {
        if (control.$ax.$tag == itemsTagName) {
          object = control.$value();
          break;
        }
        object[control.$key] = control.$output();
      }
      return object;
    },
    $enabled: true,
    $disable: (el) => () => {
      el.$enabled = false;
      let controls = el.$controls();
      for (let i in controls) {
        controls[i].$disable && controls[i].$disable();
      }
    },
    $enable: (el) => () => {
      el.$enabled = true;
      let controls = el.$controls();
      for (let i in controls) {
        controls[i].$enable && controls[i].$enable();
      }
    },
    $focus: (el) => () => {
      let first = el.$(
        'ax-appkit-form-control:not(.ax-appkit-form-control-not-focusable)'
      );
      if (first) first.$focus();
    },
    ...options.controlTag,
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-nest'](nestForm(ff), nestTagOptions),
    controlTagOptions
  );
};
