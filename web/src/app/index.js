import appCss from "./css";
import appHelpers from "./_helpers";
import appMain from "./main";

// Make app global
window.app = {
  main: appMain,
  css: appCss,
  // Merge helpers into app
  ...appHelpers
}

// Load pages
const importAll = (r) =>
  Object.assign(
    ...r.keys().map((f) => {
      let obj = {};
      obj[f.match(/\.\/((?:\w|\/|\-)+)\.md/)[1]] = r(f).default;
      return obj;
    })
  );
app.Docs = importAll(require.context("./../../../docs/", true, /\.md$/));
import readme from "./../../../README.md";
app.Docs.readme = readme;


export default app;
