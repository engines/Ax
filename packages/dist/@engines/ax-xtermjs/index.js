import "xterm/css/xterm.css";
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import axXterm from './lib/ax-xtermjs';

axXterm.dependencies = (ax) => {
  ax.extension.xtermjs.Terminal = Terminal
  ax.extension.xtermjs.FitAddon = FitAddon
}

export default axXterm
