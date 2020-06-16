/**
 * Create element for undefined content.
 */
ax.factory.undefined = function () {
  return this.element({
    $text: 'UNDEFINED',
    $init: (el) => console.warn('Component is undefined:', el),
  });
};
