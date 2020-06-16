ax.extension.transition.fade = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let duration = (options.duration || 500) / 2;

  return a['div|appkit-transition'](null, {
    $init: function () {
      let component = options.initial;
      this.style.display = 'none';
      if (component) {
        this.$in(component);
      }
    },
    $in: function (component) {
      // Show el before inserting content. For any $init functions
      // that rely on visible elements, such as resizing functions that
      // need to access el height/width.
      this.style.display = options.display || 'block';
      this.$nodes = [component];
      x.lib.animate.fade.in(this, {
        duration: duration,
        display: options.display,
        complete: () => {
          if (options.complete) options.complete(this);
        },
      });
    },
    $to: function (component) {
      if (this.style.opacity == '1') {
        x.lib.animate.fade.out(this, {
          duration: duration,
          complete: () => this.$in(component),
        });
      } else {
        this.$in(component);
      }
    },
    ...options.transitionTag,
  });
};
