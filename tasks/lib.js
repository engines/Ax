module.exports = {
  fileOrder: (a, b) => {
    const ap = a.path
        .substring(`${global.__basedir}/packages/components/`.length)
        .replace(/\..+$/, ""),
      bp = b.path
        .substring(`${global.__basedir}/packages/components/`.length)
        .replace(/\..+$/, ""),
      aa = ap.split("/"),
      ba = bp.split("/"),
      al = aa.length,
      bl = ba.length;
    for (let i in ba) {
      if (!aa[i]) return -1;
      if (aa[i] > ba[i]) return 1;
      if (aa[i] < ba[i]) return -1;
    }
    if (bl > al) return -1;
    if (bl < al) return 1;
    return 0;
  },
};
