ax.extension.lib.uuid.generate = function () {
  return '00000000-0000-4000-0000-000000000000'.replace(/0/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};
