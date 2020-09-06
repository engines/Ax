import 'chart.js/dist/Chart.css';
import Chart from 'chart.js';

import marked from 'marked';

import 'codemirror/lib/codemirror.css'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/keymap/vim.js';
import 'codemirror/keymap/emacs.js';
import 'codemirror/keymap/sublime.js';

import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import 'filepond/dist/filepond.css'
import * as FilePond from 'filepond'

import 'easymde/dist/easymde.min.css'
import EasyMDE from 'easymde';

import 'text-security/text-security.css'
import 'script-loader!html5sortable/dist/html5sortable.js'

import ax from '@engines/ax';
import axAppkit from '@engines/ax-appkit';
import axAppkitChartjs from '@engines/ax-appkit-chartjs';
import axAppkitCodemirror from '@engines/ax-appkit-codemirror';
import axAppkitDropdown from '@engines/ax-appkit-dropdown';
import axAppkitField from '@engines/ax-appkit-field';
import axAppkitFieldDependent from '@engines/ax-appkit-field-dependent';
import axAppkitFieldExtras from '@engines/ax-appkit-field-extras';
import axAppkitFieldNest from '@engines/ax-appkit-field-nest';
import axAppkitFieldNestPrefab from '@engines/ax-appkit-field-nest-prefab';
import axAppkitFilepond from '@engines/ax-appkit-filepond';
import axAppkitFormAsync from '@engines/ax-appkit-form-async';
// import axAppkitJsoneditor from '@engines/ax-appkit-jsoneditor';
import axAppkitMarkedjs from '@engines/ax-appkit-markedjs';
import axAppkitPanes from '@engines/ax-appkit-panes';
import axAppkitEasymde from '@engines/ax-appkit-easymde';
import axAppkitTwitterBootstrap4 from '@engines/ax-appkit-twitter-bootstrap4';
import axAppkitXtermjs from '@engines/ax-appkit-xtermjs';


// Load ax extensions
ax.extend(
  axAppkit,
  [axAppkitChartjs,{Chart: Chart}],
  [axAppkitCodemirror,{CodeMirror: CodeMirror}],
  axAppkitDropdown,
  axAppkitField,
  axAppkitFieldDependent,
  axAppkitFieldExtras,
  [axAppkitFieldNest,{sortable: sortable}],
  axAppkitFieldNestPrefab,
  [axAppkitFilepond,{FilePond: FilePond}],
  axAppkitFormAsync,
  // axAppkitJsoneditor,
  [axAppkitMarkedjs, {marked: marked}],
  axAppkitPanes,
  [axAppkitEasymde,{EasyMDE: EasyMDE}],
  axAppkitTwitterBootstrap4,
  [axAppkitXtermjs, {Terminal: Terminal, FitAddon: FitAddon}],
);

// Make ax global
window.ax = ax

export default ax;
