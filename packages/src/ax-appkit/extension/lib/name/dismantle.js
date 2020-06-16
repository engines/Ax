ax.extension.lib.name.dismantle = (string) =>
  (string.match(/\w+|\[\w*\]|\[\.\.\]/g) || []).map((part) =>
    part.replace(/\[|\]/g, '')
  );
