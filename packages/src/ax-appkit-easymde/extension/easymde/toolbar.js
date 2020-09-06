ax.extension.easymde.toolbar = () => [
  {
    name: 'bold',
    action: ax.x.easymde.EasyMDE.toggleBold,
    className: 'fa fa-bold',
    title: 'Bold',
  },
  {
    name: 'italic',
    action: ax.x.easymde.EasyMDE.toggleItalic,
    className: 'fa fa-italic',
    title: 'Italic',
  },
  {
    name: 'heading',
    action: ax.x.easymde.EasyMDE.toggleHeadingSmaller,
    className: 'fa fa-heading',
    title: 'Heading',
  },
  '|',
  {
    name: 'quote',
    action: ax.x.easymde.EasyMDE.toggleBlockquote,
    className: 'fa fa-quote-left',
    title: 'Quote',
  },
  {
    name: 'unordered-list',
    action: ax.x.easymde.EasyMDE.toggleUnorderedList,
    className: 'fa fa-list-ul',
    title: 'Generic List',
  },
  {
    name: 'ordered-list',
    action: ax.x.easymde.EasyMDE.toggleOrderedList,
    className: 'fa fa-list-ol',
    title: 'Numbered List',
  },
  '|',
  {
    name: 'link',
    action: ax.x.easymde.EasyMDE.drawLink,
    className: 'fa fa-link',
    title: 'Create Link',
  },
  {
    name: 'image',
    action: ax.x.easymde.EasyMDE.drawImage,
    className: 'fa fa-image',
    title: 'Insert Image',
  },
  {
    name: 'table',
    action: ax.x.easymde.EasyMDE.drawTable,
    className: 'fa fa-table',
    title: 'Insert Table',
  },
  '|',
  {
    name: 'preview',
    action: ax.x.easymde.EasyMDE.togglePreview,
    className: 'fa fa-eye no-disable',
    title: 'Toggle Preview',
  },
  {
    name: 'side-by-side',
    action: ax.x.easymde.EasyMDE.toggleSideBySide,
    className: 'fa fa-columns no-disable',
    title: 'Toggle Side by Side',
  },
  {
    name: 'fullscreen',
    action: ax.x.easymde.EasyMDE.toggleFullScreen,
    className: 'fa fa-arrows-alt no-disable',
    title: 'Toggle Fullscreen',
  },
];
