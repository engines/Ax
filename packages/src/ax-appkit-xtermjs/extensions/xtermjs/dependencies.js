ax.extensions.xtermjs.Terminal = dependencies.Terminal || window.Terminal;
// The FitAddon module exports an object, bit Xterm expects a constructor function.
let plugin = dependencies.FitAddon || window.FitAddon || {};
if (ax.is.object(plugin)) {
  ax.extensions.xtermjs.FitAddon = plugin.FitAddon;
} else {
  ax.extensions.xtermjs.FitAddon = plugin;
}
