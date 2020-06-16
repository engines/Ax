ax.extension.time = function (options = {}) {
  const a = ax.a;

  let timeTag = {
    $init: function () {
      this.$tock();
      setInterval(this.$tock, 1000);
    },
    $tock: function () {
      this.$text = new Date().toLocaleTimeString();
    },
    ...options.timeTag,
  };

  return a.time(null, timeTag);
};
