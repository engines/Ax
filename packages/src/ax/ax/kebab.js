/**
 * Convert string from camelCase to kebab-case.
 */
ax.kebab = (string) =>
  (string[0].match(/[A-Z]/) ? '-' : '') +
  string.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
