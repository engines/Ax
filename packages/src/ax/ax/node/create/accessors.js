/**
* Add methods to element.
*/
ax.node.create.accessors = function (element) {
  this.accessors.nodes(element)
  this.accessors.html(element)
  this.accessors.text(element)
  this.accessors.on(element)
  this.accessors.off(element)
  this.accessors.send(element)
};
