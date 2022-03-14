// import DOMPurify from "dompurify";
import highlightjs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import javascript from "highlight.js/lib/languages/javascript";
import shell from "highlight.js/lib/languages/shell";
import "highlight.js/styles/vs.css";
highlightjs.registerLanguage("xml", xml);
highlightjs.registerLanguage("javascript", javascript);
highlightjs.registerLanguage("shell", shell);

const mdUNSAFE = (markdown, options) =>
  x.markedjs({
    ...options,
    markdown: markdown,
    // sanitize: DOMPurify.sanitize,
    markedjs: {
      highlight: function (code, lang) {
        return highlightjs.highlight(lang, code).value;
      },
    },
  });

export default mdUNSAFE;
