ax.extension.transition.fade = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let duration = (options.duration || 500) / 2;

  return a['ax-appkit-transition'](null, {
    $init: (el) => {
      el.style.display = 'none';
      if (options.initial) {
        el.$in(options.initial);
      }
    },
    $in: (el) => (component) => {
      // Show el before inserting content. For any $init functions
      // that rely on visible elements, such as resizing functions that
      // need to access el height/width.
      el.style.display = options.display || 'block';
      el.$nodes = [component];
      x.lib.animate.fade.in(el, {
        duration: duration,
        display: options.display,
        complete: () => {
          if (options.complete) options.complete(el);
        },
      });
    },
    $to: (el) => (component) => {
      if (el.style.opacity == '1') {
        x.lib.animate.fade.out(el, {
          duration: duration,
          complete: () => el.$in(component),
        });
      } else {
        el.$in(component);
      }
    },
    id: options.id,
    ...options.transitionTag,
  });
};
