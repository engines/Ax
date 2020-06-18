import './css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";

import app from './app';
import ax from '@engines/ax';
import axAppkit from '@engines/ax-appkit';
import axChartjs from '@engines/ax-chartjs';
import axMarkedjs from '@engines/ax-markedjs';
import axXtermjs from '@engines/ax-xtermjs';
import helpers from './app/_helpers';
// import appPages from '../lib/pages';
// import appExamples from '../lib/examples';

// import txt from './file.txt';

// Load pages
const importAll = (r) => Object.assign(...r.keys().map( f => {
  let obj = {}
  obj[f.match(/\w+/)[0]] = r(f).default
  return obj
}));
app.Docs = importAll(require.context('./../../docs/', false, /\.md$/))
// app.Pages = importAll(require.context('./../pages/', false, /\.md$/))

import readme from './../../README.md'

app.Docs.readme = readme

// Load ax extensions
ax.extend( axAppkit, axChartjs, axMarkedjs, axXtermjs );

// Merge helpers into app
Object.assign(app, helpers);

// Make app global
window.app = app;

ax(app);
