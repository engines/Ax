module.exports = {
  fileDepthSort: (a, b) => {
    const dir = `${__dirname.replace(/tasks$/, "")}packages/src/`,
      aPath = a.path.substring(dir.length).replace(/\..+$/, ""),
      bPath = b.path.substring(dir.length).replace(/\..+$/, ""),
      aDirs = aPath.split("/"),
      bDirs = bPath.split("/");
    (aLength = aDirs.length), (bLength = bDirs.length);

    if (aLength > bLength) return 1;
    if (aLength < bLength) return -1;
    for (let i in bDirs) {
      if (!aDirs[i]) return -1;
      if (aDirs[i] > bDirs[i]) return 1;
      if (aDirs[i] < bDirs[i]) return -1;
    }
    return 0;
  },
};
