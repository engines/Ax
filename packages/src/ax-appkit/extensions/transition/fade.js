ax.extensions.transition.fade = function (options = {}) {
  let duration = (options.duration || 500) / 2;
  return a['ax-appkit-transition']({
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
          el.$send('ax.appkit.transition.complete');
          if (options.complete) options.complete(el);
        },
      });
      el.$send('ax.appkit.transition.in');
      if (options.in) options.in(el);
    },
    $to: (el) => (component) => {
      if (el.style.opacity == '1') {
        x.lib.animate.fade.out(el, {
          duration: duration,
          complete: () => el.$in(component),
        });
        el.$send('ax.appkit.transition.out');
      } else {
        el.$in(component);
      }
    },
    id: options.id,
    ...options.transitionTag,
  });
};
